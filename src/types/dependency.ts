import type { DecoratorScopeTypes } from "./decorators";

export interface Dependency {
  abstraction: string;
  implementation: string;
  path: string;
  scope: DecoratorScopeTypes;
}

export type BindingType = "default" | "dynamic";
