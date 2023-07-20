# Inversify Generator

[Inversify](https://github.com/inversify/InversifyJS) it's a great inversion of control container for TypeScript.
But due to the nature of TypeScript and the inability to infer types at runtime Inversify and every other
IoC for TypeScript relies on identifiers to assign an implementation to an abstraction.

This packages tries to make the process of assigning an identifier to an implementation a little bit
less cumbersome by generating type identifiers and bindings for inversify automatically.

## Install

```shell
yarn install inversify-generator
```

## Usage

First you must configure the generator settings.

There are two ways, through command flags or through a `inversify-generator.json`
config file.

### Options

| Option     | Description                                                              | Default           |
| ---------- | ------------------------------------------------------------------------ | ----------------- |
| `tsconfig` | Path to the tsconfig file                                                | `./tsconfig.json` |
| `out`      | Path to the output directory                                             | `./src/ioc`       |
| `binding`  | Type of binding applied to the<br/>implementations in the generated file | `default`         |
| `watch`    | Watch files for binding and types generation                             | `false`           |

Type `inversify-generator -h` to see a list of available flags and how to use them.

`inversify-generator.json` config file example:

```json
{
  "tsconfig": "./tsconfig.json",
  "out": "./src/ioc",
  "binding": "default"
}
```

### Binding type

One of the configuration options it's `binding`. This configuration has two possibilities:
`default` or `dynamic`.

The `default` will generate the bindings in a simple manner directly to the container
as stated in inversify documentation:

Example of generated file with this binding:

```typescript
import { Container } from "inversify";
import { TYPES } from "./types";
import { Ninja } from "./entities/ninja";
import { Katana } from "./entities/katana";
import { Shuriken } from "./entities/shuriken";

const myContainer = new Container();
myContainer.bind(TYPES.Warrior).to(Ninja);
myContainer.bind(TYPES.Weapon).to(Katana);
myContainer.bind(TYPES.ThrowableWeapon).to(Shuriken);

export { myContainer };
```

On the other hand the `dynamic` type will use a util exposed by this package that
binds implementations with [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
adding the possibility of creating [providers (asynchronous factories)](https://github.com/inversify/InversifyJS/blob/master/wiki/provider_injection.md).

If you are using inversify in a front end app, this method will probably make
your main bundle smaller (as long as the sections that load the async factories are not executed)
because it will only download the corresponding dependency chunk needed.

This would be an example of the generated file by the `dynamic` binding type:

```typescript
import { Container } from "inversify";
import { TYPES } from "./types";
import { bindDynamicModule } from "inversify-generator/utils";

const myContainer = new Container();
bindDynamicModule(TYPES.Warrior, () => import("./entities/ninja"), locator.bind);
bindDynamicModule(TYPES.Weapon, () => import("./entities/katana"), locator.bind);
bindDynamicModule(TYPES.ThrowableWeapon, () => import("./entities/shuriken"), locator.bind);

export { myContainer };
```

> **IMPORTANT**
> Using `dynamic` binding has the current limitation that the function only binds the
> first exported module of the file. Meaning, if you have more than one class exported
> in the file and decorated with `@injectable` only the first one will be bound. So if you
> are using the `dynamic` type try having one class implementation per file.

## Usage

```bash
nvm use # Sets the correct node version
corepack enable # Enables pnpm
pnpm install # Installs dependencies
mkdir out # Creates output directory
pnpm run dev # Runs program
```

## Dependencies

- `ts-morph`: Typescript AST analyser
- `yargs`: Command line arguments parser

## Roadmap

- [ ] Add support for modules
- [ ] Add tests
- [ ] Add possibility to have several exported modules in a file to use
      with the `dynamic` binding method.
