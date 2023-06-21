# IoC Generator

Generates the boilerplate code for an IoC container. Used for dependency injection config.

## Usage

```bash
nvm use # Sets the correct node version
npm install # Installs dependencies
mkdir out # Creates output directory
npm run dev # Runs program
```

## Dependencies

`ts-morph`: Typescript AST analyser

## Roadmap

- [x] Implement syntax analysis
- [x] Implement IoC boilerplate generation
- [ ] Add command line arguments to configure the paths of the tsconfig file and the output directory.
- [ ] Refactor code
- [ ] Add tests
- [ ] Publish to npm
