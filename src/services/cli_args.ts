import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Args } from "../types/args.js";

export function getCliArgs(): Partial<Args> {
  return yargs(hideBin(process.argv)).argv as Partial<Args>;
}
