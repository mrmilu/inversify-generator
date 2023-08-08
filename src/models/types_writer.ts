import type { Dependency } from "./dependency";
import type { Config } from "../types/config";
import { writeFilePromise } from "../utils/write";

export class TypesWriter {
  dependencies: Array<Dependency>;
  config: Config;

  constructor(dependencies: Array<Dependency>, config: Config) {
    this.dependencies = dependencies;
    this.config = config;
  }

  write(): Promise<void> {
    const typesFileString = `
    export const TYPES = {
      ${this.dependencies
        .map(({ abstraction, customTypeName }) => {
          const typeName = customTypeName ?? abstraction;
          return `${typeName}: Symbol.for('${typeName}'),`;
        })
        .join("\n")}
    };`;
    return writeFilePromise(`${this.config.output}/types.ts`, typesFileString);
  }
}
