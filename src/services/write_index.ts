import { Args } from "../types/args.js";
import { Dependency } from "../types/dependency.js";
import { writeFilePromise } from "../utils/file.js";

export function writeIndexFile(
  dependencies: Dependency[],
  args: Partial<Args>
) {
  const indexFileString = `import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { bindDynamicModule } from "./utils";

const locator = new Container();

`.concat(
    dependencies
      .map(
        ({ abstraction, path }) =>
          `bindDynamicModule(TYPES.${abstraction}, () => import("${path}"));`
      )
      .join("\n")
  ).concat(`

export { locator };`);
  return writeFilePromise(`${args.out}/index.ts`, indexFileString);
}
