# IoC Generator

Generates the boilerplate code for an IoC container. Used for dependency injection config.

## Configuration options

| Option     | Description                  | Default           |
| ---------- | ---------------------------- | ----------------- |
| `tsconfig` | Path to the tsconfig file    | `./tsconfig.json` |
| `out`      | Path to the output directory | `./src/ioc`       |

These configuration options can be passed as command line arguments in the POSIX format, e.g. `--tsconfig ./tsconfig.json`.

The configuration options can also be set in the `ioc-boilerplate-generator.json` config file, which is optional and must be located in the root directory of the project. The command line arguments take precedence over the config file. This is an example config file:

```json
{
  "tsconfig": "./tsconfig.json",
  "out": "./src/ioc"
}
```

## Usage

```bash
nvm use # Sets the correct node version
corepack enable # Enables pnpm
pnpm install # Installs dependencies
mkdir out # Creates output directory
pnpm run dev # Runs program
```

## Dependencies

`ts-morph`: Typescript AST analyser
`yargs`: Command line arguments parser

## Roadmap

- [x] Implement syntax analysis
- [x] Implement IoC boilerplate generation
- [x] Add command line arguments to configure the paths of the tsconfig file and the output directory.
- [x] Refactor code
- [ ] Add tests
- [ ] Publish to npm
