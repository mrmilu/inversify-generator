import { DependenciesResolverService } from "./services/dependencies_resolver_service";
import { WriterService } from "./services/writer_service";
import cliService from "./services/cli_service";
import { ConfigService } from "./services/config_service";

async function run() {
  const args = await cliService.args();
  const configService = new ConfigService(args);

  const depResolver = new DependenciesResolverService(configService.config);

  try {
    const writer = new WriterService(depResolver.dependencies, configService.config);
    await writer.generate();
    console.log("\x1b[32m%s\x1b[0m", "IoC boilerplate generated successfully");
  } catch (err) {
    console.error(err);
  }
}

run();
