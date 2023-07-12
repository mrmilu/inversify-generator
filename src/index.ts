import { writeIndexFile } from "./services/write_index.js";
import { writeTypesFile } from "./services/write_types.js";
import { ArgsService } from "./services/args_service.js";
import { DependenciesResolverService } from "./services/dependencies_resolver_service.js";

async function run() {
  // TODO: CLI arguments
  const args = new ArgsService().getArgs();

  const depResolver = new DependenciesResolverService(args);

  try {
    await Promise.all([writeIndexFile(depResolver.dependencies, args), writeTypesFile(depResolver.dependencies, args)]);
    console.log("\x1b[32m%s\x1b[0m", "IoC boilerplate generated successfully");
  } catch (err) {
    console.error(err);
  }
}

run();
