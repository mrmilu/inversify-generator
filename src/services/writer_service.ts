import type { Dependency } from "../types/dependency";
import type { Config } from "../types/config";
import { writeFile } from "fs";

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
    await Promise.all([this.indexFile(), this.typesFile()]);
  }

  private indexFile() {
    const indexFileString = DEFAULT_INDEX_FILE_TEMPLATE.concat(
      this.dependencies.map(({ abstraction, path }) => `bindDynamicModule(TYPES.${abstraction}, () => import("${path}"));`).join("\n")
    ).concat(`export { locator };`);
    return this.writeFilePromise(`${this.config.out}/index.ts`, indexFileString);
  }

  private typesFile(): Promise<void> {
    const typesFileString = `export const TYPES = {
        `.concat(this.dependencies.map(({ abstraction, implementation }) => `  ${abstraction}: Symbol.for('${implementation}'),`).join("\n")).concat(`
        };
        `);
    return this.writeFilePromise(`${this.config.out}/types.ts`, typesFileString);
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
