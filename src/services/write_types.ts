import { Args } from "../types/args.js";
import { Dependency } from "../types/dependency.js";
import { writeFilePromise } from "../utils/file.js";

export function writeTypesFile(
  dependencies: Dependency[],
  args: Partial<Args>
): Promise<void> {
  const typesFileString = `export const TYPES = {
        `.concat(
    dependencies
      .map(
        ({ abstraction, implementation }) =>
          `  ${abstraction}: Symbol.for('${implementation}'),`
      )
      .join("\n")
  ).concat(`
        };
        `);
  return writeFilePromise(`${args.out}/types.ts`, typesFileString);
}
