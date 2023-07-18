import type { DecoratorScopeTypes } from "./types/decorators";

export function containerScope(scope: DecoratorScopeTypes) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Function): void => {
    if (scope !== "transient" && scope !== "singleton" && scope !== "request") {
      throw new Error(`Wrong decorator scope type for ${target.name}. Use one of the followings: 'transient' | 'singleton' | 'request'`);
    }
  };
}
