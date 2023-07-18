import type { Dependency } from "../types/dependency";
import type { Config } from "../types/config";
import { writeFile, existsSync } from "fs";

import cliService from "./cli_service";
import * as process from "process";

const DEFAULT_INDEX_FILE_TEMPLATE = (extraImports: string = "") => `
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

    if (this.config.binding === "dynamic") {
      indexFileString = DEFAULT_INDEX_FILE_TEMPLATE(`import { bindDynamicModule } from "inversify-generator/utils";`);
      indexFileString = indexFileString.concat(
        this.dependencies.map(({ abstraction, path }) => `bindDynamicModule(TYPES.${abstraction}, () => import("${path}"), locator.bind);`).join("\n")
      );
    } else {
      const depImports = this.dependencies.map(({ implementation, path }) => {
        return `import { ${implementation} } from "${path}";`;
      });
      indexFileString = DEFAULT_INDEX_FILE_TEMPLATE(depImports.join("\n")).concat(
        this.dependencies.map(({ abstraction, implementation }) => `locator.bind(TYPES.${abstraction}).to(${implementation});`).join("\n")
      );
    }

    return this.writeFilePromise(`${this.config.output}/index.ts`, indexFileString.concat(`\n\nexport { locator };`));
  }

  private typesFile(): Promise<void> {
    const typesFileString = `export const TYPES = {
        `.concat(this.dependencies.map(({ abstraction, implementation }) => `${abstraction}: Symbol.for('${implementation}'),`).join("\n")).concat(`
        };
        `);
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
