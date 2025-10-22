// apps/complete-fitness-tracker/codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli'
import path from 'node:path'
import fs from 'node:fs'

const isCI = !!process.env.VERCEL || process.env.CI === 'true'


const snapshotFile = path.resolve(__dirname, 'schema.graphql')


const snapshotSDL = fs.readFileSync(snapshotFile, 'utf8')

const schemaUrl = process.env.SCHEMA_URL ?? 'http://127.0.0.1:4000/api/graphql'
const token = process.env.SCHEMA_TOKEN
const headers: Record<string, string> | undefined = token
  ? { apikey: token, Authorization: `Bearer ${token}` }
  : undefined

type HttpSchemaPointer = { [url: string]: { headers?: Record<string, string> } }
const remote: HttpSchemaPointer[] = [{ [schemaUrl]: { headers } }]


const schemaSource: CodegenConfig['schema'] = isCI
  ? snapshotSDL
  : (remote as unknown as CodegenConfig['schema'])

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
