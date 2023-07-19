import type { Config } from "../types/config";
import { Dependency } from "../models/dependency";
import type { BindingType, ScopeType } from "../types/dependency";
import { Project, Node } from "ts-morph";
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

        const configDecorator = classDeclaration.getDecorator("generatorConf");
        const hasConfigDecorator = Boolean(configDecorator);
        const configDecoratorArg = configDecorator?.getArguments()[0];
        let dependencyScope: ScopeType | undefined;
        let dependencyBinding: BindingType | undefined;
        if (hasConfigDecorator && Node.isObjectLiteralExpression(configDecoratorArg)) {
          const scopeProperty = configDecoratorArg.getProperty("scope");
          const bindingProperty = configDecoratorArg.getProperty("binding");
          if (scopeProperty) {
            dependencyScope = this.removeQuotes(scopeProperty.getLastChild()?.getText()) as ScopeType | undefined;
          }
          if (bindingProperty) {
            dependencyBinding = this.removeQuotes(bindingProperty.getLastChild()?.getText()) as BindingType | undefined;
          }
        }

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

  private removeQuotes(str: string | undefined) {
    return str?.replaceAll('"', "").replaceAll("'", "");
  }
}
