// src/services/graphql-client.ts
import { GraphQLClient } from 'graphql-request'

const BASE_URL =
  typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:4000'
    : window.location.origin

const GRAPHQL_API_URL = '/api/graphql'
const ENDPOINT = `${BASE_URL}${GRAPHQL_API_URL}`

export const gqlClient = new GraphQLClient(ENDPOINT, {
  headers: { 'Content-Type': 'application/json' },
})

export function setAuthToken(token: string) {
  gqlClient.setHeader('Authorization', `Bearer ${token}`)
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token)
  }
}

export function clearAuthToken() {
  gqlClient.setHeader('Authorization', '')
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
  }
}

export function initializeAuth() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken')
    if (token) {
      gqlClient.setHeader('Authorization', `Bearer ${token}`)
    }
  }
}

initializeAuth()
