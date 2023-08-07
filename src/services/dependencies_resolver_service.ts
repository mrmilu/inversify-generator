import type { Config } from "../types/config";
import { Dependency } from "../models/dependency";
import { Project, Node } from "ts-morph";
import * as process from "process";
import { relative, join } from "path";
import { DecoratorConfig } from "../models/decorator_config";

export class DependenciesResolverService {
  dependencies: Array<Dependency> = [];

  constructor(config: Config) {
    this.getDependencies(config);
  }

  static hasInversifyDecorator(filePath: string) {
    const project = new Project();
    project.addSourceFileAtPath(filePath);
    const sourceFile = project.getSourceFile(filePath);
    return sourceFile?.getClasses().some((classDeclaration) => Boolean(classDeclaration.getDecorator("injectable")));
  }

  private getDependencies(config: Config) {
    new Project({ tsConfigFilePath: config.tsconfig }).getSourceFiles().forEach((sourceFile) => {
      sourceFile.getClasses().forEach((classDeclaration) => {
        const hasDecorator = Boolean(classDeclaration.getDecorator("injectable"));
        if (!hasDecorator) return;

        const { dependencyScope, dependencyBinding } = new DecoratorConfig(classDeclaration);

        const className = classDeclaration.getName();
        if (!className) return;

        const implement = classDeclaration.getImplements()[0];
        let abstraction: string | undefined = implement?.getText();
        if (implement?.getChildCount() === 1 && Node.isPropertyAccessExpression(implement.getLastChild())) {
          abstraction = implement.getLastChild()?.getLastChild()?.getText();
        }

        const relativePath = relative(join(process.cwd(), config.output), sourceFile.getFilePath()).replace(/\.[^.]*$/, "");
        this.dependencies.push(
          new Dependency({
            path: relativePath,
            abstraction: abstraction ?? className,
            implementation: className,
            scope: dependencyScope,
            binding: dependencyBinding
          })
        );
      });
    });
  }
}
