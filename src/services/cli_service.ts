/* eslint-disable @typescript-eslint/no-unused-vars */
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type { Config } from "../types/config";
import chalk from "chalk";

const TSCONFIG_ARG = { t: "t", tsconfig: "tsconfig" };
const OUTPUT_ARG = { o: "o", output: "output" };

class CliService {
  async args(): Promise<Partial<Config>> {
    const { tsconfig, output } = await yargs(hideBin(process.argv))
      .usage("Usage: $0 [flags]")
      .example("$0 --tsconfig ./tsconfig.json", "Generate types and bindings with given tsconfig")
      .alias(TSCONFIG_ARG.t, TSCONFIG_ARG.tsconfig)
      .nargs(TSCONFIG_ARG.t, 1)
      .describe(TSCONFIG_ARG.t, "Project tsconfig file path")
      .alias(OUTPUT_ARG.o, OUTPUT_ARG.output)
      .nargs(OUTPUT_ARG.o, 1)
      .describe(OUTPUT_ARG.o, "Output path to where bindings and types will be generated")
      .help("h")
      .alias("h", "help").argv;
    return { tsconfig, output } as Config;
  }

  error(message: string) {
    console.log(chalk.red(message));
  }

  success(message: string) {
    console.log(chalk.green(message));
  }

  warning(message: string) {
    console.log(chalk.hex("#FFA500")(message));
  }
}

export default new CliService();
