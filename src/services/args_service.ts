import type { Args } from "../types/args.js";
import yargs from "yargs";
import { readFileSync } from "fs";
import { hideBin } from "yargs/helpers";

export class ArgsService {
  args: Args = {
    tsconfig: "./tsconfig.json",
    out: "./src/ioc"
  };

  getArgs() {
    return [this.args, this.getConfigArgs(), this.getCliArgs()].map(this.removeFalsyValues).reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }

  private removeFalsyValues<T extends object>(obj: T): Partial<T> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v)) as Partial<T>;
  }

  private getCliArgs(): Partial<Args> {
    return yargs(hideBin(process.argv)).argv as Partial<Args>;
  }

  private getConfigArgs(): Partial<Args> {
    return JSON.parse(readFileSync("./ioc-boilerplate-generator.json", "utf8"));
  }
}
