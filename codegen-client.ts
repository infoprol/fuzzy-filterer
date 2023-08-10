import type { CodegenConfig } from "@graphql-codegen/cli";

const clientConfig: CodegenConfig = {
  overwrite: true,
  schema: "src/graphql/schema.graphql",
  documents: [
    "src/{app,lib,components}/**/*.{ts,tsx}",
  ],
  ignoreNoDocuments: true,
  generates: {
    "src/lib/gql-generated/": {
      plugins: [
        "typescript", 
        "typescript-operations",
        "typed-document-node",],
      
      preset: "client",
    },
  },
}

export default clientConfig