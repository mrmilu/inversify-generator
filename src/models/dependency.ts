import type { BindingType, ScopeType } from "../types/dependency";

export type DependencyConstructor = Omit<Dependency, "itsSingletonScope" | "itsTransientScope" | "itsDefaultBinding" | "itsDynamicBinding">;

export class Dependency {
  abstraction: string;
  implementation: string;
  path: string;
  scope?: ScopeType;
  binding?: BindingType;

  constructor(params: DependencyConstructor) {
    this.abstraction = params.abstraction;
    this.implementation = params.implementation;
    this.path = params.path;
    this.scope = params.scope;
    this.binding = params.binding;
  }

  get itsDefaultBinding(): boolean {
    return this.binding === "default";
  }

  get itsDynamicBinding(): boolean {
    return this.binding === "dynamic";
  }

  get itsSingletonScope(): boolean {
    return this.scope === "singleton";
  }

  get itsTransientScope(): boolean {
    return this.scope === "transient";
  }
}
