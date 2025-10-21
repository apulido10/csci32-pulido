import type { CodegenConfig } from '@graphql-codegen/cli';

const isCI = !!process.env.VERCEL || !!process.env.CI
const schemaSource = isCI
  ? './schema.graphql'
  : 'http://localhost:4000/api/graphql'

const config: CodegenConfig = {
  schema: schemaSource,
  documents: ['src/**/*.{ts,tsx,graphql,gql}', '!src/generated/**/*'],
  generates: {
    'schema.graphql': {
      plugins: ['schema-ast'],
    },
    'src/generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: { gqlTagName: 'graphql' },
      config: {
        useTypeImports: true,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
}

export default config
