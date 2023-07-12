'use strict';

var yargs = require('yargs');
var helpers = require('yargs/helpers');
var fs = require('fs');
var tsMorph = require('ts-morph');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var yargs__default = /*#__PURE__*/_interopDefault(yargs);

function getCliArgs() {
  return yargs__default["default"](helpers.hideBin(process.argv)).argv;
}

function getConfigArgs() {
  return JSON.parse(fs.readFileSync("./ioc-boilerplate-generator.json", "utf8"));
}

const defaultArgs = {
  tsconfig: "./tsconfig.json",
  out: "./src/ioc"
};
function removeFalsyValues(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v));
}
function getArgs() {
  return [defaultArgs, getConfigArgs(), getCliArgs()].map(removeFalsyValues).reduce((acc, curr) => ({
    ...acc,
    ...curr
  }), {});
}

function getDependencies(args) {
  const dependencies = [];
  new tsMorph.Project({
    tsConfigFilePath: args.tsconfig
  }).getSourceFiles().forEach(sourceFile => {
    sourceFile.getClasses().forEach(classDeclaration => {
      const hasDecorator = Boolean(classDeclaration.getDecorator("injectable"));
      if (!hasDecorator) return;
      const className = classDeclaration.getName();
      if (!className) return;
      const implement = classDeclaration.getImplements()[0];
      dependencies.push({
        path: sourceFile.getFilePath().replace(/^.*src/, "@/src"),
        abstraction: implement?.getText() ?? className,
        implementation: className
      });
    });
  });
  return dependencies;
}

function writeFilePromise(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, err => {
      if (err) reject(err);else resolve();
    });
  });
}

function writeIndexFile(dependencies, args) {
  const indexFileString = `import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { bindDynamicModule } from "./utils";

const locator = new Container();

`.concat(dependencies.map(({
    abstraction,
    path
  }) => `bindDynamicModule(TYPES.${abstraction}, () => import("${path}"));`).join("\n")).concat(`

export { locator };`);
  return writeFilePromise(`${args.out}/index.ts`, indexFileString);
}

function writeTypesFile(dependencies, args) {
  const typesFileString = `export const TYPES = {
        `.concat(dependencies.map(({
    abstraction,
    implementation
  }) => `  ${abstraction}: Symbol.for('${implementation}'),`).join("\n")).concat(`
        };
        `);
  return writeFilePromise(`${args.out}/types.ts`, typesFileString);
}

async function run() {
  // TODO: CLI arguments
  const args = getArgs();
  const dependencies = getDependencies(args);
  try {
    await Promise.all([writeIndexFile(dependencies, args), writeTypesFile(dependencies, args)]);
    console.log("\x1b[32m%s\x1b[0m", "IoC boilerplate generated successfully");
  } catch (err) {
    console.error(err);
  }
}
run();
