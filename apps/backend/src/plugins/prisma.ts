import fp from 'fastify-plugin'
import { PrismaClient } from 'csci32-database'
import type { FastifyInstance } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

export const PRISMA_FASTIFY_PLUGIN_NAME = 'prisma'

export default fp(
  async function prismaPlugin(fastify: FastifyInstance) {
    const prisma = new PrismaClient()

    fastify.decorate('prisma', prisma)

    fastify.addHook('onClose', async () => {
      await prisma.$disconnect()
    })
  },
  {
    name: PRISMA_FASTIFY_PLUGIN_NAME,
  },
)
