// apps/complete-fitness-tracker/codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli'
import fs from 'node:fs'
import path from 'node:path'

// Always load schema.graphql that sits NEXT TO this file.
// No env vars, no dashboard, no renames, no fragile CWD.
const primary = path.join(__dirname, 'schema.graphql')

// Optional fallback: if Turbo runs from a different place locally
const fallback = path.join(process.cwd(), 'apps/complete-fitness-tracker/schema.graphql')

const schemaPath = fs.existsSync(primary) ? primary
                 : fs.existsSync(fallback) ? fallback
                 : null

if (!schemaPath) {
  throw new Error(
    [
      'schema.graphql not found.',
      `Tried:`,
      ` - ${primary}`,
      ` - ${fallback}`,
      `Place schema.graphql next to codegen.ts: apps/complete-fitness-tracker/schema.graphql`,
    ].join('\n')
  )
}

const schemaSDL = fs.readFileSync(schemaPath, 'utf8')

const config: CodegenConfig = {
  // Inline the SDL so CI/local behave the same
  schema: schemaSDL,
  documents: ['src/**/*.{ts,tsx,graphql,gql}', '!src/generated/**/*'],
  generates: {
    'schema.graphql': { plugins: ['schema-ast'] },
    'src/generated/': {
      preset: 'client',
      plugins: [],
      // You are using graphql(`...`) in code
      presetConfig: { gqlTagName: 'graphql' },
      config: { useTypeImports: true },
    },
  },
  ignoreNoDocuments: true,
  hooks: { afterAllFileWrite: ['prettier --write'] },
}

export default config
