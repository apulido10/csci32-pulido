import { PrismaClient } from 'csci32-database'

export interface ServiceDeps {
  prisma?: PrismaClient
}

export type CreatePostInput = {
  title: string
  body: string
  comments?: { body: string }[]
}

export class PostService {
  private prisma: PrismaClient

  constructor(deps: ServiceDeps) {
    this.prisma = deps.prisma ?? new PrismaClient()
  }

  async createForAuthor(input: CreatePostInput, authorUserId: string) {
    const { title, body, comments } = input

    if (comments?.length) {
      return this.prisma.post.create({
        data: {
          title,
          body,
          authorId: authorUserId,
          comments: { create: comments },
        },
        include: { author: true, comments: true },
      })
    }

    return this.prisma.post.create({
      data: { title, body, authorId: authorUserId },
      include: { author: true },
    })
  }
}
