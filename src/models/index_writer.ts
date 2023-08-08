import type { Dependency } from "./dependency";
import type { Config } from "../types/config";
import { writeFilePromise } from "../utils/write";

const DEFAULT_INDEX_FILE_TEMPLATE = (extraImports: string = "") => `// This is an auto generated file created by inversify-generator
// Please don't make any changes as you might lose them in future generations
import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
${extraImports}
const locator = new Container();
`;

export class IndexWriter {
  dependencies: Array<Dependency>;
  config: Config;
  private indexFileString: string = "";
  private importsString: string = "";
  private stringBindings = "";
  private hasAtLeastOneDynamic = false;
  private hasAtLeastOneDynamicSingleton = false;
  private defaultBindingsDep: Array<Dependency> = [];

  constructor(dependencies: Array<Dependency>, config: Config) {
    this.dependencies = dependencies;
    this.config = config;
  }

  write(): Promise<void> {
    this.dependencies.forEach((dep) => this.depWriter(dep));

    this.importsString = this.importsString.concat(
      [
        this.hasAtLeastOneDynamicSingleton ? 'import { bindSingletonDynamicModule } from "inversify-generator/utils";\n' : "",
        this.hasAtLeastOneDynamic ? 'import { bindDynamicModule } from "inversify-generator/utils";\n' : ""
      ].join("")
    );

    this.importsString = this.importsString.concat(
      this.defaultBindingsDep.map(({ implementation, path }) => `import { ${implementation} } from "${path}";\n`).join("")
    );

    this.indexFileString = DEFAULT_INDEX_FILE_TEMPLATE(this.importsString).concat(this.stringBindings);

    return writeFilePromise(`${this.config.output}/index.ts`, this.indexFileString.concat(`\nexport { locator };`));
  }

  private depWriter(dep: Dependency) {
    const typeName = dep.customTypeName ?? dep.abstraction;

    if ((this.config.binding === "dynamic" && !dep.itsDefaultBinding) || dep.itsDynamicBinding) {
      this.stringBindings = this.stringBindings.concat(
        `bind${dep.itsSingletonScope ? "Singleton" : ""}DynamicModule(TYPES.${typeName}, () => import("${dep.path}"), locator);\n`
      );
      if (!this.hasAtLeastOneDynamic) this.hasAtLeastOneDynamic = true;
      if (!this.hasAtLeastOneDynamicSingleton) this.hasAtLeastOneDynamicSingleton = dep.itsSingletonScope;
    } else if ((this.config.binding === "default" && !dep.itsDynamicBinding) || dep.itsDefaultBinding) {
      this.stringBindings = this.stringBindings.concat(
        `locator.bind(TYPES.${typeName}).to(${dep.implementation})${dep.itsSingletonScope ? ".inSingletonScope()" : ""};\n`
      );
      this.defaultBindingsDep.push(dep);
    }
  }
}
