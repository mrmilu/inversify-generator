import type { Dependency } from "../models/dependency";
import type { Config } from "../types/config";
import { writeFile, existsSync } from "fs";
import cliService from "./cli_service";
import * as process from "process";

const DEFAULT_INDEX_FILE_TEMPLATE = (extraImports: string = "") => `// This is an auto generated file created by inversify-generator
// Please don't make any changes as you might lose them in future generations
import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
${extraImports}
const locator = new Container();
`;

export class WriterService {
  dependencies: Array<Dependency>;
  config: Config;

  constructor(dependencies: Array<Dependency>, config: Config) {
    this.dependencies = dependencies;
    this.config = config;
  }

  async generate() {
    this.outputExists();
    await Promise.all([this.indexFile(), this.typesFile()]);
  }

  private indexFile() {
    let indexFileString: string = "";
    let importsString: string = "";
    let stringBindings = "";
    let hasAtLeastOneDynamic = false;
    let hasAtLeastOneDynamicSingleton = false;
    const defaultBindingsDep: Array<Dependency> = [];

    this.dependencies.forEach((dep) => {
      if ((this.config.binding === "dynamic" && !dep.itsDefaultBinding) || dep.itsDynamicBinding) {
        stringBindings = stringBindings.concat(
          `bind${dep.itsSingletonScope ? "Singleton" : ""}DynamicModule(TYPES.${dep.abstraction}, () => import("${dep.path}"), locator.bind);\n`
        );
        if (!hasAtLeastOneDynamic) hasAtLeastOneDynamic = true;
        if (!hasAtLeastOneDynamicSingleton) hasAtLeastOneDynamicSingleton = dep.itsSingletonScope;
      } else if ((this.config.binding === "default" && !dep.itsDynamicBinding) || dep.itsDefaultBinding) {
        stringBindings = stringBindings.concat(
          `locator.bind(TYPES.${dep.abstraction}).to(${dep.implementation})${dep.itsSingletonScope ? ".inSingletonScope()" : ""};\n`
        );
        defaultBindingsDep.push(dep);
      }
    });

    importsString = importsString.concat(
      [
        hasAtLeastOneDynamicSingleton ? 'import { bindSingletonDynamicModule } from "inversify-generator/utils";\n' : "",
        hasAtLeastOneDynamic ? 'import { bindDynamicModule } from "inversify-generator/utils";\n' : ""
      ].join("")
    );
    importsString = importsString.concat(
      defaultBindingsDep.map(({ implementation, path }) => `import { ${implementation} } from "${path}";\n`).join("")
    );

    indexFileString = DEFAULT_INDEX_FILE_TEMPLATE(importsString).concat(stringBindings);

    return this.writeFilePromise(`${this.config.output}/index.ts`, indexFileString.concat(`\nexport { locator };`));
  }

  private typesFile(): Promise<void> {
    const typesFileString = `
    export const TYPES = {
      ${this.dependencies
        .map(({ abstraction }) => {
          return `${abstraction}: Symbol.for('${abstraction}'),`;
        })
        .join("\n")}
    };`;
    return this.writeFilePromise(`${this.config.output}/types.ts`, typesFileString);
  }

  private outputExists() {
    const dirExists = existsSync(this.config.output);
    if (!dirExists) {
      cliService.error(`Directory ${this.config.output} not found.\nPlease create the directory or change the output path.`);
      process.exit(1);
    } else {
      cliService.success(`Directory ${this.config.output} found`);
      cliService.success("Generating files...");
    }
  }

  private writeFilePromise(path: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      writeFile(path, content, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
