# IoC Generator

Generates the boilerplate code for an IoC container. Used for dependency injection config.

## Usage

```bash
mkdir out ## Creates output directory
npm run dev
```

## Dependencies

`ts-morph`: Typescript AST analyser

## Roadmap

- [x] Implement syntax analysis
- [x] Implement IoC boilerplate generation
- [ ] Add command line arguments to configure the paths of the config file and the output directory.
- [ ] Refactor code
- [ ] Add tests
- [ ] Publish to npm
