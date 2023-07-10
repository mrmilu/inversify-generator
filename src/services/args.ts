import { Args } from "../types/args.js";
import { getCliArgs } from "./cli_args.js";
import { getConfigArgs } from "./config_args.js";

const defaultArgs: Args = {
  tsconfig: "./tsconfig.json",
  out: "./src/ioc",
};
function removeFalsyValues<T extends {}>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v)
  ) as Partial<T>;
}
export function getArgs() {
  return [defaultArgs, getConfigArgs(), getCliArgs()]
    .map(removeFalsyValues)
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});
}
