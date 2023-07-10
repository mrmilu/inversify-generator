import { readFileSync } from "fs";
import { Args } from "../types/args.js";

export function getConfigArgs(): Partial<Args> {
  return JSON.parse(readFileSync("./ioc-boilerplate-generator.json", "utf8"));
}