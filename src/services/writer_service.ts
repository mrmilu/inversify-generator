import type { Dependency } from "../types/dependency";
import type { Config } from "../types/config";
import { writeFile, existsSync } from "fs";

import cliService from "./cli_service";
import * as process from "process";

const DEFAULT_INDEX_FILE_TEMPLATE = `import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { bindDynamicModule } from "./utils";

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
    const indexFileString = DEFAULT_INDEX_FILE_TEMPLATE.concat(
      this.dependencies.map(({ abstraction, path }) => `bindDynamicModule(TYPES.${abstraction}, () => import("${path}"));`).join("\n")
    ).concat(`\n\nexport { locator };`);
    return this.writeFilePromise(`${this.config.output}/index.ts`, indexFileString);
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
