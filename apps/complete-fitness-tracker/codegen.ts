// apps/complete-fitness-tracker/codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli'
import fs from 'node:fs'
import path from 'node:path'


const schemaFile = path.resolve(process.cwd(), 'apps/complete-fitness-tracker/schema.graphql')
if (!fs.existsSync(schemaFile)) {
  throw new Error(`schema.graphql not found at ${schemaFile}`)
}
const schemaSDL = fs.readFileSync(schemaFile, 'utf8')

const config: CodegenConfig = {
  schema: schemaSDL,
  documents: ['src/**/*.{ts,tsx,graphql,gql}', '!src/generated/**/*'],
  generates: {
    'schema.graphql': { plugins: ['schema-ast'] },
    'src/generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: { gqlTagName: 'graphql' },          
      config: { useTypeImports: true },
    },
  },
  ignoreNoDocuments: true,
  hooks: { afterAllFileWrite: ['prettier --write'] },
}

export default config
