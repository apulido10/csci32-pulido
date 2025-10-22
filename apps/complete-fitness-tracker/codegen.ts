// apps/complete-fitness-tracker/codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli'
import path from 'node:path'

const isCI = !!process.env.VERCEL || process.env.CI === 'true'

// Use your existing snapshot file name
const snapshotPath = path.resolve(__dirname, 'schema.graphql')

// Local/dev hits your running server (NOTE: /api/graphql)
const schemaUrl = process.env.SCHEMA_URL ?? 'http://127.0.0.1:4000/api/graphql'
const token = process.env.SCHEMA_TOKEN

const headers: Record<string, string> | undefined = token
  ? { apikey: token, Authorization: `Bearer ${token}` }
  : undefined

type HttpSchemaPointer = { [url: string]: { headers?: Record<string, string> } }
const remote: HttpSchemaPointer[] = [{ [schemaUrl]: { headers } }]

// CI uses the committed schema.graphql; local uses the running server
const schemaSource: CodegenConfig['schema'] = isCI
  ? snapshotPath
  : (remote as unknown as CodegenConfig['schema'])

const config: CodegenConfig = {
  schema: schemaSource,
  documents: ['src/**/*.{ts,tsx,graphql,gql}', '!src/generated/**/*'],
  generates: {
    'schema.graphql': { plugins: ['schema-ast'] },
    'src/generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: { gqlTagName: 'graphql' }, // you use graphql(`...`)
      config: { useTypeImports: true },
    },
  },
  ignoreNoDocuments: true,
  hooks: { afterAllFileWrite: ['prettier --write'] },
}

export default config
