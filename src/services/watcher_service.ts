import chokidar from "chokidar";
import process from "process";
export class WatcherService {
  watcher: chokidar.FSWatcher;
  constructor() {
    this.watcher = this.init();
  }

  private init() {
    return chokidar.watch(process.cwd(), { ignored: [/\.*\/node_modules\/.*/, /^.*\.(?!js$|ts$)[^.]*$/] });
  }
}
