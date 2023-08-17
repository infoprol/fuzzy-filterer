import type { CodegenConfig } from "@graphql-codegen/cli";
import { defineConfig as defineServerConfig } from "@eddeee888/gcg-typescript-resolver-files";

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/graphql/schema.graphql",
  documents: ["src/{app,lib,components}/**/*.{ts,tsx}"],
  ignoreNoDocuments: true,
  generates: {
    "src/lib/graphql-codegened/server": defineServerConfig(),
    "src/lib/graphql-codegened/client/": {
      plugins: [],
      preset: "client",
      config: {
        maybeValue: "T|undefined|null",
        mappings: {
          ProductResult: "./src/lib/types#Product",
          // "String!": "string",
        },
      },
    },
  },
};

export default config;
