import { writeFilePromise } from "../utils/file";
import type { Dependency } from "../types/dependency";
import type { Args } from "../types/args";

export function writeIndexFile(dependencies: Array<Dependency>, args: Partial<Args>) {
  const indexFileString = `import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { bindDynamicModule } from "./utils";

const locator = new Container();

`.concat(dependencies.map(({ abstraction, path }) => `bindDynamicModule(TYPES.${abstraction}, () => import("${path}"));`).join("\n")).concat(`

export { locator };`);
  return writeFilePromise(`${args.out}/index.ts`, indexFileString);
}
