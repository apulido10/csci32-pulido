
import type { CodegenConfig } from '@graphql-codegen/cli'
import path from 'node:path'
import fs from 'node:fs'

const isCI = !!process.env.VERCEL || process.env.CI === 'true'


const localSnapshotPath = path.resolve(__dirname, 'schema.graphql')
const localSDL = fs.existsSync(localSnapshotPath)
  ? fs.readFileSync(localSnapshotPath, 'utf8')
  : undefined


const ciSchemaUrl = process.env.SCHEMA_URL 
if (isCI && !ciSchemaUrl) {
  throw new Error(
    'SCHEMA_URL is not set in CI. Set SCHEMA_URL to your deployed API (…/api/graphql) or commit schema.graphql and load it locally.'
  )
}

const schemaSource: CodegenConfig['schema'] = isCI
  ? ([{ [ciSchemaUrl!]: {} }] as unknown as CodegenConfig['schema'])
  : (localSDL ?? ([{ 'http://127.0.0.1:4000/api/graphql': {} }] as unknown)) as CodegenConfig['schema']

const config: CodegenConfig = {
  schema: schemaSource,
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
