
import { prisma, type PrismaClient, type Prisma } from 'csci32-database'

export interface ServiceDeps {
  prisma: PrismaClient
}

export type CreatePostInput = {
  title: string
  body: string
  comments?: { body: string }[]
}

export type ListPostsOptions = {
  search?: string
  skip?: number
  take?: number
  sortField?: 'createdAt' | 'title'
  sortDirection?: 'asc' | 'desc'
}

export class PostService {
  constructor(private deps: ServiceDeps) {}

  async create(input: CreatePostInput, authorUserId: string) {
    const data: Prisma.PostCreateInput = {
      title: input.title,
      body: input.body,
      author: {
        connect: { user_id: authorUserId },
      },
      ...(input.comments && input.comments.length
        ? {
            comments: {
              create: input.comments.map((c) => ({ body: c.body })),
            },
          }
        : {}),
    }

    return prisma.post.create({ data })
  }

  async findOneById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: true,
      },
    })
  }

  async findMany(options: ListPostsOptions = {}) {
    const {
      search,
      skip = 0,
      take = 10,
      sortField = 'createdAt',
      sortDirection = 'desc',
    } = options

    const where: Prisma.PostWhereInput =
      search && search.trim().length > 0
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { body: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}

    const orderBy: Prisma.PostOrderByWithRelationInput = {
      [sortField]: sortDirection,
    }

    return prisma.post.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        author: true,
        comments: true,
      },
    })
  }
}
