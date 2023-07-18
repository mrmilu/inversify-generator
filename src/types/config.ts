import type { BindingType } from "./dependency";

export interface Config {
  tsconfig: string;
  output: string;
  binding: BindingType;
}
