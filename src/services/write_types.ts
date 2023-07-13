import type { Args } from "../types/args";
import type { Dependency } from "../types/dependency";
import { writeFilePromise } from "../utils/file";

export function writeTypesFile(dependencies: Array<Dependency>, args: Partial<Args>): Promise<void> {
  const typesFileString = `export const TYPES = {
        `.concat(dependencies.map(({ abstraction, implementation }) => `  ${abstraction}: Symbol.for('${implementation}'),`).join("\n")).concat(`
        };
        `);
  return writeFilePromise(`${args.out}/types.ts`, typesFileString);
}
