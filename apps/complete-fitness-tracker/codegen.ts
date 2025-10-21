import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/api/graphql',
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
