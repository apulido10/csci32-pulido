// apps/complete-fitness-tracker/codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli'
import path from 'node:path'

const isCI = !!process.env.VERCEL || process.env.CI === 'true'

// CI uses a checked-in snapshot (make sure this file exists & is committed)
const localSnapshot = path.resolve(__dirname, 'schema.local.graphql')

// Local/dev uses your running server (FIXED: /api/graphql, not /graphql)
const schemaUrl = process.env.SCHEMA_URL ?? 'http://127.0.0.1:4000/api/graphql'
const token = process.env.SCHEMA_TOKEN

const supabaseHeaders: Record<string, string> | undefined = token
  ? { apikey: token, Authorization: `Bearer ${token}` }
  : undefined

type HttpSchemaPointer = { [url: string]: { headers?: Record<string, string> } }
const remoteWithHeaders: HttpSchemaPointer[] = [{ [schemaUrl]: { headers: supabaseHeaders } }]

const schemaSource: CodegenConfig['schema'] = isCI
  ? localSnapshot
  : (remoteWithHeaders as unknown as CodegenConfig['schema'])

console.log(`[codegen] Using ${isCI ? 'snapshot' : 'remote'} schema: ${isCI ? localSnapshot : schemaUrl}`)

const config: CodegenConfig = {
  schema: schemaSource,
  documents: ['src/**/*.{ts,tsx,graphql,gql}', '!src/generated/**/*'],
  generates: {
    'schema.graphql': { plugins: ['schema-ast'] },
    'src/generated/': {
      preset: 'client',
      plugins: [],
      // IMPORTANT: matches your usage: graphql(`...`)
      presetConfig: { gqlTagName: 'graphql' },
      config: { useTypeImports: true },
    },
  },
  ignoreNoDocuments: true,
  hooks: { afterAllFileWrite: ['prettier --write'] },
}

export default config
