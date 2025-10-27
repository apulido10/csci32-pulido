import type { SignUpInput } from '@/resolvers/types/AuthTypes'
import { comparePassword, hashPassword, signToken } from '@/utils/auth'
import { PrismaClient, PermissionName, BASIC_ROLE_ID } from 'csci32-database'

export interface UserServiceProps {
  prisma: PrismaClient
}

export class UserService {
  prisma: PrismaClient

  constructor({ prisma }: UserServiceProps) {
    this.prisma = prisma
  }

  findMany() {
    return this.prisma.user.findMany()
  }

  async createUser(params: SignUpInput) {
    const { email, password, name } = params

    const existing = await this.prisma.user.findUnique({ where: { email } })
    if (existing) throw new Error('Email already in use')

    const passwordHash = await hashPassword(password)

    const created = await this.prisma.user.create({
      data: {
        email,
        name: name ?? null,
        passwordHash,
        role: { connect: { role_id: BASIC_ROLE_ID } },
      },
      select: {
        user_id: true,
        email: true,
        name: true,
        role: { select: { name: true, role_permissions: { select: { permission: { select: { name: true } } } } } },
      },
    })

    const token = signToken({
      sub: created.user_id,
      email: created.email,
      name: created.name ?? undefined,
      role: created.role?.name,
      permissions: created.role?.role_permissions.map((p) => p.permission.name) ?? [],
    })

    return { user: created, token }
  }

  async authenticateUser(params: { email: string; password: string }) {
    const { email, password } = params

    const found = await this.prisma.user.findUnique({
      where: { email },
      select: {
        user_id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: { select: { name: true, role_permissions: { select: { permission: { select: { name: true } } } } } },
      },
    })

    if (!found || !found.passwordHash) throw new Error('Invalid email or password')

    const ok = await comparePassword(password, found.passwordHash)
    if (!ok) throw new Error('Invalid email or password')

    const token = signToken({
      sub: found.user_id,
      email: found.email,
      name: found.name ?? undefined,
      role: found.role?.name,
      permissions: found.role?.role_permissions.map((p) => p.permission.name) ?? [],
    })

    const { passwordHash, ...user } = found as any
    return { user, token }
  }
}
