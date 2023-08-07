import type { GeneratorDecoratorParams } from "./types/decorators";

export function generatorConf({ scope, binding }: GeneratorDecoratorParams = {}) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Function): void => {
    if (scope !== "transient" && scope !== "singleton") {
      throw new Error(`Wrong config scope for ${target.name}. Use one of the followings: 'transient' | 'singleton'`);
    }
    if (binding !== "default" && binding !== "dynamic") {
      throw new Error(`Wrong config binding type for ${target.name}. Use one of the followings: 'default' | 'dynamic'`);
    }
  };
}
