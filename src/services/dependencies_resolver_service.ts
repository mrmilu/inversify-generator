import { Args } from "../types/args.js";
import { Dependency } from "../types/dependency.js";
import { Project } from "ts-morph";

export class DependenciesResolverService {
  dependencies: Dependency[] = [];

  constructor(args: Partial<Args>) {
    this.getDependencies(args);
  }

  private getDependencies(args: Partial<Args>) {
    new Project({ tsConfigFilePath: args.tsconfig }).getSourceFiles().forEach((sourceFile) => {
      sourceFile.getClasses().forEach((classDeclaration) => {
        const hasDecorator = Boolean(classDeclaration.getDecorator("injectable"));
        if (!hasDecorator) return;

        const className = classDeclaration.getName();
        if (!className) return;

        const implement = classDeclaration.getImplements()[0];
        this.dependencies.push({
          path: sourceFile.getFilePath().replace(/^.*src/, "@/src"),
          abstraction: implement?.getText() ?? className,
          implementation: className
        });
      });
    });
  }
}
