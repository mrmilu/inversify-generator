import type { Config } from "../types/config";
import { readFileSync } from "fs";

const DEFAULT_CONFIG: Config = {
  tsconfig: "./tsconfig.json",
  output: "./src/ioc",
  binding: "default",
  watch: false
};

export class ConfigService {
  config: Config = DEFAULT_CONFIG;

  constructor(args: Partial<Config> = {}) {
    this.config = this.init(args);
  }

  init(args: Partial<Config> = {}): Config {
    const cleanConfigs = [args, this.getConfigFile()].map(this.removeFalsyValues);
    return cleanConfigs.reduce<Config>((acc, curr) => ({ ...acc, ...curr }), this.config);
  }

  private removeFalsyValues<T extends object>(obj: T): Partial<T> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v)) as Partial<T>;
  }

  private getConfigFile(): Partial<Config> {
    try {
      const rawConfigFile = readFileSync("./inversify-generator.json", "utf8");
      return JSON.parse(rawConfigFile);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.code === "ENOENT") {
        return {};
      }
      throw e;
    }
  }
}
