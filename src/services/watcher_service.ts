import chokidar from "chokidar";
import process from "process";
import * as fs from "fs";
export class WatcherService {
  watcher: chokidar.FSWatcher;
  constructor() {
    this.watcher = this.init();
  }

  private init() {
    return chokidar.watch(process.cwd(), { ignored: [/\.*\/node_modules\/.*/, /^.*\.(?!js$|ts$)[^.]*$/] });
  }

  isTsJsFile(path: string) {
    return fs.lstatSync(path).isFile() && path.match(/\.(ts|js)/);
  }
}
