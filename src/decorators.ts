import type { GeneratorDecoratorParams } from "./types/decorators";

export function generatorConf({ scope, binding, typeName }: GeneratorDecoratorParams = {}) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Function): void => {
    if (typeName && typeName.length === 0) {
      throw new Error(`Type name can't be an empty string for ${target.name}.`);
    }
    if (scope && scope !== "transient" && scope !== "singleton") {
      throw new Error(`Wrong config scope for ${target.name}. Use one of the followings: 'transient' | 'singleton'`);
    }
    if (binding && binding !== "default" && binding !== "dynamic") {
      throw new Error(`Wrong config binding type for ${target.name}. Use one of the followings: 'default' | 'dynamic'`);
    }
  };
}
