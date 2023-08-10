import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/graphql/schema.graphql",
  documents: [
    "src/{app,lib,components}/**/*.{ts,tsx}",
  ],
  ignoreNoDocuments: true,
  generates: {
    "src/lib/graphql-codegened/": {
      plugins: [],
      preset: "client",
    },
  },
}

export default config