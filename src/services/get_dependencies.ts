import { Project } from "ts-morph";
import { Args } from "../types/args.js";
import { Dependency } from "../types/dependency.js";

export function getDependencies(args: Partial<Args>) {
  const dependencies: Dependency[] = [];

  const project = new Project({
    tsConfigFilePath: args.tsconfig,
  });
  
  project.getSourceFiles().forEach((sourceFile) => {
    sourceFile.getClasses().forEach((classDeclaration) => {
      const hasDecorator = Boolean(classDeclaration.getDecorator("injectable"));
      if (!hasDecorator) return;

      const className = classDeclaration.getName();
      if (!className) return;

      const implement = classDeclaration.getImplements()[0];
      dependencies.push({
        path: sourceFile.getFilePath().replace(/^.*src/, "@/src"),
        abstraction: implement?.getText() ?? className,
        implementation: className,
      });
    });
  });

  return dependencies;
}
