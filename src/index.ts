import { Project } from "ts-morph";
import { writeFilePromise } from "./utils/file.js";

// TODO: CLI arguments
const tsConfigFilePath = "../aserta-siniestros.front/tsconfig.json";
const outDirPath = "./out";

interface Dependency {
  abstraction: string;
  implementation: string;
  path: string;
}
const imports: Dependency[] = [];

const project = new Project({
  tsConfigFilePath,
});
project.getSourceFiles().forEach((sourceFile) => {
  sourceFile.getClasses().forEach((classDeclaration) => {
    const hasDecorator = Boolean(classDeclaration.getDecorator("injectable"));
    if (!hasDecorator) return;

    const className = classDeclaration.getName();
    if (!className) return;

    const implement = classDeclaration.getImplements()[0];
    imports.push({
      path: sourceFile.getFilePath().replace(/^.*src/, "@/src"),
      abstraction: implement?.getText() ?? className,
      implementation: className,
    });
  });
});

const typesFileString = `export const TYPES = {
`.concat(
  imports
    .map(
      ({ abstraction, implementation }) =>
        `  ${abstraction}: Symbol.for('${implementation}'),`
    )
    .join("\n")
).concat(`
};
`);

const indexFileString = `import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { bindDynamicModule } from "./utils";

const locator = new Container();

`.concat(
  imports
    .map(
      ({ abstraction, path }) =>
        `bindDynamicModule(TYPES.${abstraction}, () => import("${path}"));`
    )
    .join("\n")
).concat(`

export { locator };`);

try {
  await Promise.all([
    writeFilePromise(`${outDirPath}/index.ts`, indexFileString),
    writeFilePromise(`${outDirPath}/types.ts`, typesFileString),
  ]);
  console.log("\x1b[32m%s\x1b[0m", "Done!");
} catch (err) {
  console.error(err);
}
