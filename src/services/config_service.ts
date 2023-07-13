import type { Config } from "../types/config";
import { readFileSync } from "fs";

const DEFAULT_CONFIG: Config = {
  tsconfig: "./tsconfig.json",
  out: "./src/ioc"
};

export class ConfigService {
  config: Config;

  constructor(args: Partial<Config> = {}) {
    this.config = this.init(args);
  }

  init(args: Partial<Config> = {}): Config {
    return [args, this.config, this.getConfigFile()].map(this.removeFalsyValues).reduce<Config>((acc, curr) => ({ ...acc, ...curr }), DEFAULT_CONFIG);
  }

  private removeFalsyValues<T extends object>(obj: T): Partial<T> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v)) as Partial<T>;
  }

  private getConfigFile(): Partial<Config> {
    try {
      const rawConfigFile = readFileSync("./ioc-boilerplate-generator.json", "utf8");
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
