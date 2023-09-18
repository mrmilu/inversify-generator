import chokidar from "chokidar";
import process from "process";
import { escapeRegExp } from "../utils/string";

export class WatcherService {
  watcher: chokidar.FSWatcher;

  constructor() {
    this.watcher = this.init();
  }

  private init() {
    return chokidar.watch(process.cwd(), {
      ignored: [/\.*\/node_modules\/.*/, new RegExp(`^(${escapeRegExp(process.cwd())}).*\\.(?!js$|ts$)[^.]*$`)]
    });
  }
}
