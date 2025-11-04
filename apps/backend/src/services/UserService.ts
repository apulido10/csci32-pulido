import type { SignUpInput } from "@/resolvers/types/AuthTypes";
import type { FindManyUsersFilters } from "@/resolvers/types/FindManyUsersFilters";
import type { FindManyUsersInput } from "@/resolvers/types/FindManyUsersInput";
import { SortOrder } from "@/resolvers/types/SortOrder";
import { comparePassword, hashPassword, signToken } from "@/utils/auth";
import { PrismaClient, BASIC_ROLE_ID, Prisma } from "csci32-database";

export interface UserServiceProps {
  prisma: PrismaClient;
}

export class UserService {
  prisma: PrismaClient;

  constructor({ prisma }: UserServiceProps) {
    this.prisma = prisma;
  }

  getOrderBy(params?: FindManyUsersInput): Prisma.UserOrderByWithRelationInput {
    const sortColumn = params?.sortColumn;
    const sortDirection = params?.sortDirection;
    if (sortColumn) {
      return { [sortColumn]: sortDirection ?? SortOrder.ASC };
    }
    return { name: SortOrder.ASC };
  }

  getUsersWhereClause(
    params?: { filters?: FindManyUsersFilters }
  ): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};
    const q = params?.filters?.query;

    if (q && q.trim().length > 0) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    return where;
  }

  async findMany(params?: FindManyUsersInput) {
    const skip = params?.skip ?? 0;
    const take = params?.take ?? 15;
    const orderBy = this.getOrderBy(params);
    const where = this.getUsersWhereClause(
      params?.filters ? { filters: params.filters } : undefined
    );

    return this.prisma.user.findMany({
      skip,
      take,
      orderBy,
      where,
    });
  }

  async getTotalUsers(filters?: FindManyUsersFilters) {
    const where = this.getUsersWhereClause(
      filters ? { filters } : undefined
    );
    return this.prisma.user.count({ where });
  }

  async createUser(params: SignUpInput) {
    const { email, password, name } = params;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already in use");

    const passwordHash = await hashPassword(password);

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
        role: {
          select: {
            name: true,
            role_permissions: {
              select: { permission: { select: { name: true } } },
            },
          },
        },
      },
    });

    const token = signToken({
      sub: created.user_id,
      email: created.email,
      name: created.name ?? undefined,
      role: created.role?.name,
      permissions:
        created.role?.role_permissions.map((p) => p.permission.name) ?? [],
    });

    return { user: created, token };
  }

  async authenticateUser(params: { email: string; password: string }) {
    const { email, password } = params;

    const found = await this.prisma.user.findUnique({
      where: { email },
      select: {
        user_id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: {
          select: {
            name: true,
            role_permissions: {
              select: { permission: { select: { name: true } } },
            },
          },
        },
      },
    });

    if (!found || !found.passwordHash)
      throw new Error("Invalid email or password");

    const ok = await comparePassword(password, found.passwordHash);
    if (!ok) throw new Error("Invalid email or password");

    const token = signToken({
      sub: found.user_id,
      email: found.email,
      name: found.name ?? undefined,
      role: found.role?.name,
      permissions:
        found.role?.role_permissions.map((p) => p.permission.name) ?? [],
    });

    const { passwordHash, ...user } = found as any;
    return { user, token };
  }
}
