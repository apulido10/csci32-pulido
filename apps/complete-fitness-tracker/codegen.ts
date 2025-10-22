import type { CodegenConfig } from '@graphql-codegen/cli'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Load the schema that sits NEXT TO this file.
// This path is stable locally AND on Vercel.
const schemaSDL = readFileSync(join(__dirname, 'schema.graphql'), 'utf8')

const config: CodegenConfig = {
  schema: schemaSDL, // inline the SDL so no file/URL resolution at runtime
  documents: ['src/**/*.{ts,tsx,graphql,gql}', '!src/generated/**/*'],
  generates: {
    'schema.graphql': { plugins: ['schema-ast'] },
    'src/generated/': {
      preset: 'client',
      plugins: [],
      // you use graphql(`...`) in your code
      presetConfig: { gqlTagName: 'graphql' },
      config: { useTypeImports: true },
    },
  },
  ignoreNoDocuments: true,
  hooks: { afterAllFileWrite: ['prettier --write'] },
}

export default config
