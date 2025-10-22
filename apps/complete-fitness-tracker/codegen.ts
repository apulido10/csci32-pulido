// apps/complete-fitness-tracker/codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli'
import path from 'node:path'

const isCI = !!process.env.VERCEL || process.env.CI === 'true'

// CI uses a checked-in snapshot so builds don’t hit localhost
const localSnapshot = path.resolve(__dirname, 'schema.local.graphql')

// Local/dev hits your running server (NOTE: /api/graphql)
const schemaUrl = process.env.SCHEMA_URL ?? 'http://127.0.0.1:4000/api/graphql'

// If you have a token, add it here; otherwise leave undefined
const token = process.env.SCHEMA_TOKEN
const headers: Record<string, string> | undefined = token
  ? { apikey: token, Authorization: `Bearer ${token}` }
  : undefined

type HttpSchemaPointer = { [url: string]: { headers?: Record<string, string> } }
const remote: HttpSchemaPointer[] = [{ [schemaUrl]: { headers } }]

// Use snapshot in CI, remote locally
const schemaSource: CodegenConfig['schema'] = isCI
  ? localSnapshot
  : (remote as unknown as CodegenConfig['schema'])

console.log(
  `[codegen] Using ${isCI ? 'snapshot' : 'remote'} schema: ${isCI ? localSnapshot : schemaUrl}`
)

const config: CodegenConfig = {
  schema: schemaSource,
  documents: ['src/**/*.{ts,tsx,graphql,gql}', '!src/generated/**/*'],
  generates: {
    'schema.graphql': { plugins: ['schema-ast'] },
    'src/generated/': {
      preset: 'client',
      plugins: [],
      // you’re using `graphql(\`...\`)` in code
      presetConfig: { gqlTagName: 'graphql' },
      config: { useTypeImports: true },
    },
  },
  ignoreNoDocuments: true,
  hooks: { afterAllFileWrite: ['prettier --write'] },
}

export default config
