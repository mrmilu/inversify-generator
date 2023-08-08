import type { BindingType, ScopeType } from "./dependency";

export interface GeneratorDecoratorParams {
  scope?: ScopeType;
  binding?: BindingType;
  typeName?: string;
}
