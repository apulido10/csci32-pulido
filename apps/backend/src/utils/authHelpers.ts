import type { Context } from '@/utils/graphql'
import jwt from 'jsonwebtoken'
import type { JwtPayload as DefaultJwtPayload } from 'jsonwebtoken'
import type { PermissionName } from 'csci32-database'
import { getRequiredStringEnvVar } from '@/utils'

interface JwtPayload extends DefaultJwtPayload {
  sub: string
  email?: string
  role?: string
  permissions?: PermissionName[]
}

export function getDecodedToken(ctx: Context): JwtPayload {
  const authHeader = ctx.request?.headers?.authorization as string | undefined
  if (!authHeader) throw new Error('Unauthorized')

  const token = authHeader.replace('Bearer ', '')
  const decoded = jwt.verify(token, getRequiredStringEnvVar('PRIVATE_KEY'), {
    algorithms: [((process.env.ALGORITHM ?? 'ES256') as jwt.Algorithm)],
  })

  return decoded as JwtPayload
}

// NEW: this matches what your PostResolver imports/uses
export function getUserIdFromJwt(ctx: Context): string {
  const payload = getDecodedToken(ctx)
  return payload.sub
}
