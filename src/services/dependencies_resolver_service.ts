import type { Config } from "../types/config";
import type { Dependency } from "../types/dependency";
import { Project } from "ts-morph";

export class DependenciesResolverService {
  dependencies: Array<Dependency> = [];

  constructor(config: Config) {
    this.getDependencies(config);
  }

  private getDependencies(args: Partial<Config>) {
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
