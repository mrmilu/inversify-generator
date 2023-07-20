/* eslint-disable @typescript-eslint/no-unused-vars */
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type { Config } from "../types/config";
import chalk from "chalk";

const TSCONFIG_ARG = { t: "t", tsconfig: "tsconfig" };
const OUTPUT_ARG = { o: "o", output: "output" };
const BINDING_ARG = { b: "b", binding: "binding" };
const WATCH_ARG = { w: "w", watch: "watch" };

export class CliService {
  static async args(): Promise<Partial<Config>> {
    const { tsconfig, output, binding, watch } = await yargs(hideBin(process.argv))
      .wrap(yargs.terminalWidth() - 5)
      .usage("Usage: $0 [flags]")
      .example("$0 --tsconfig ./tsconfig.json", "Generate types and bindings with given tsconfig")
      .options({
        [TSCONFIG_ARG.tsconfig]: {
          alias: TSCONFIG_ARG.t,
          describe: "Project tsconfig file path"
        },
        [OUTPUT_ARG.output]: {
          alias: OUTPUT_ARG.o,
          describe: "Output path to where bindings and types will be generated"
        },
        [BINDING_ARG.binding]: {
          alias: BINDING_ARG.b,
          describe: "Binding type for creating bindings to locator",
          choices: ["default", "dynamic"]
        },
        [WATCH_ARG.watch]: {
          alias: WATCH_ARG.w,
          describe: "Watch file changes to execute generator",
          boolean: true
        }
      })
      .help("h")
      .alias("h", "help").argv;
    return { tsconfig, output, binding, watch } as Config;
  }

  static error(message: string) {
    console.log(chalk.red(message));
  }

  static success(message: string) {
    console.log(chalk.green(message));
  }

  static warning(message: string) {
    console.log(chalk.hex("#FFA500")(message));
  }
}
