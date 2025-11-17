import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import { PostService } from '@/services/PostService'

declare module 'fastify' {
  interface FastifyInstance {
    postService: PostService
  }
}

export const POST_SERVICE_FASTIFY_PLUGIN_NAME = 'postService'

export default fp(async function postServicePlugin(fastify: FastifyInstance) {
  const postService = new PostService({ prisma: fastify.prisma })
  fastify.decorate(POST_SERVICE_FASTIFY_PLUGIN_NAME, postService)
})
