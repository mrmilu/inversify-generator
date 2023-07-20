import { DependenciesResolverService } from "./services/dependencies_resolver_service";
import { WriterService } from "./services/writer_service";
import { ConfigService } from "./services/config_service";
import { CliService } from "./services/cli_service";
import { WatcherService } from "./services/watcher_service";

async function build(configService: ConfigService) {
  let depResolver: DependenciesResolverService | undefined = undefined;
  try {
    depResolver = new DependenciesResolverService(configService.config);
  } catch (e) {
    if (e instanceof Error) {
      CliService.error(e.message);
    }
  }

  if (depResolver) {
    try {
      const writer = new WriterService(depResolver.dependencies, configService.config);
      await writer.generate();
      CliService.success("Types and bindings generated correctly!");
    } catch (err) {
      console.error(err);
    }
  }
}

async function run() {
  const args = await CliService.args();
  const configService = new ConfigService(args);
  await build(configService);
  if (configService.config.watch) {
    const watcherService = new WatcherService();
    watcherService.watcher.on("change", (path) => {
      if (DependenciesResolverService.hasInversifyDecorator(path)) build(configService);
    });
  }
}

run();
