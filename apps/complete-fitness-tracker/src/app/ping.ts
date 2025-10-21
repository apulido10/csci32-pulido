import { gql } from 'graphql-tag';
// or: import { gql } from 'graphql-request';

export const Ping = gql`
  query Ping {
    __typename
  }
`;
