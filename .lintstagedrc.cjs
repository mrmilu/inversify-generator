module.exports = {
  "**/*": [() => "pnpm check-types", () => "pnpm lint", "prettier --write --ignore-unknown"]
};
