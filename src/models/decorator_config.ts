import type { BindingType, ScopeType } from "../types/dependency";
import type { ClassDeclaration } from "ts-morph";
import { Node } from "ts-morph";

export class DecoratorConfig {
  dependencyScope?: ScopeType;
  dependencyBinding?: BindingType;
  typeName?: string;
  private readonly className?: string;

  constructor(classDeclaration: ClassDeclaration) {
    this.className = classDeclaration.getName();
    this._init(classDeclaration);
    this.validate();
  }

  private _init(classDeclaration: ClassDeclaration) {
    const configDecorator = classDeclaration.getDecorator("generatorConf");
    const hasConfigDecorator = Boolean(configDecorator);
    const configDecoratorArg = configDecorator?.getArguments()[0];
    if (hasConfigDecorator && Node.isObjectLiteralExpression(configDecoratorArg)) {
      const scopeProperty = configDecoratorArg.getProperty("scope");
      const bindingProperty = configDecoratorArg.getProperty("binding");
      const typeNameProperty = configDecoratorArg.getProperty("typeName");
      if (scopeProperty) {
        this.dependencyScope = this.removeQuotes(scopeProperty.getLastChild()?.getText()) as ScopeType | undefined;
      }
      if (bindingProperty) {
        this.dependencyBinding = this.removeQuotes(bindingProperty.getLastChild()?.getText()) as BindingType | undefined;
      }
      if (typeNameProperty) {
        this.typeName = this.removeQuotes(typeNameProperty?.getLastChild()?.getText());
      }
    }
  }

  private removeQuotes(str: string | undefined) {
    return str?.replaceAll('"', "").replaceAll("'", "");
  }

  private validate() {
    if (this.dependencyScope?.length === 0) {
      throw new Error(`Dependency scope can't be an empty string for ${this.className}`);
    } else if (this.dependencyScope && this.dependencyScope !== "transient" && this.dependencyScope !== "singleton") {
      throw new Error(`Wrong config scope for ${this.className}. Use one of the followings: 'transient' | 'singleton'`);
    }
    if (this.dependencyBinding?.length === 0) {
      throw new Error(`Dependency binding can't be an empty string for ${this.className}`);
    } else if (this.dependencyBinding && this.dependencyBinding !== "default" && this.dependencyBinding !== "dynamic") {
      throw new Error(`Wrong config binding type for ${this.className}. Use one of the followings: 'default' | 'dynamic'`);
    }
  }
}
