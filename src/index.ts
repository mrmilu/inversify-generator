import { getArgs } from "./services/args.js";
import { getDependencies } from "./services/get_dependencies.js";
import { writeIndexFile } from "./services/write_index.js";
import { writeTypesFile } from "./services/write_types.js";

async function run() {
  // TODO: CLI arguments
  const args = getArgs();

  const dependencies = getDependencies(args);

  try {
    await Promise.all([
      writeIndexFile(dependencies, args),
      writeTypesFile(dependencies, args),
    ]);
    console.log("\x1b[32m%s\x1b[0m", "IoC boilerplate generated successfully");
  } catch (err) {
    console.error(err);
  }
}

run()