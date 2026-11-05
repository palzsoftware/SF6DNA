import { defineConfig, globalIgnores } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  { files: ["**/*.mts"], languageOptions: { parser: tsParser } },
  globalIgnores([".next/**", "node_modules/**"]),
]);
