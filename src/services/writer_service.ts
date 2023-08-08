import type { Dependency } from "../models/dependency";
import type { Config } from "../types/config";
import { existsSync } from "fs";
import { CliService } from "./cli_service";
import * as process from "process";
import { IndexWriter } from "../models/index_writer";
import { TypesWriter } from "../models/types_writer";

export class WriterService {
  dependencies: Array<Dependency>;
  config: Config;

  constructor(dependencies: Array<Dependency>, config: Config) {
    this.dependencies = dependencies;
    this.config = config;
  }

  async generate() {
    this.outputExists();
    const indexWriter = new IndexWriter(this.dependencies, this.config);
    const typesWriter = new TypesWriter(this.dependencies, this.config);
    await Promise.all([indexWriter.write(), typesWriter.write()]);
  }

  private outputExists() {
    const dirExists = existsSync(this.config.output);
    if (!dirExists) {
      CliService.error(`Directory ${this.config.output} not found.\nPlease create the directory or change the output path.`);
      process.exit(1);
    } else {
      CliService.success(`Directory ${this.config.output} found`);
      CliService.success("Generating files...");
    }
  }
}
