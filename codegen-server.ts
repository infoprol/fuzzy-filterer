import type { CodegenConfig } from "@graphql-codegen/cli"

const serverConfig: CodegenConfig = {
  overwrite: true,
  schema: "src/graphql/schema.graphql",
  generates: {
    "src/lib/graphql-codegened/server/resolver-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        useIndexSignature: true,
      },
    },
  },
} 
      
export default serverConfig