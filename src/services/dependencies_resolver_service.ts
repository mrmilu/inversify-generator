import type { Config } from "../types/config";
import type { Dependency } from "../types/dependency";
import { Project } from "ts-morph";
import * as process from "process";
import { relative, join } from "path";

export class DependenciesResolverService {
  dependencies: Array<Dependency> = [];

  constructor(config: Config) {
    this.getDependencies(config);
  }

  private getDependencies(config: Config) {
    new Project({ tsConfigFilePath: config.tsconfig }).getSourceFiles().forEach((sourceFile) => {
      sourceFile.getClasses().forEach((classDeclaration) => {
        const hasDecorator = Boolean(classDeclaration.getDecorator("injectable"));
        if (!hasDecorator) return;

        const className = classDeclaration.getName();
        if (!className) return;

        const implement = classDeclaration.getImplements()[0];
        const relativePath = relative(join(process.cwd(), config.output), sourceFile.getFilePath()).replace(/\.[^.]*$/, "");
        this.dependencies.push({
          path: relativePath,
          abstraction: implement?.getText() ?? className,
          implementation: className
        });
      });
    });
  }
}
