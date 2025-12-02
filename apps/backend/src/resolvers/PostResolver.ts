

import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import type { Context } from '@/utils/graphql'
import { CreatePostInput } from '@/resolvers/types/CreatePostInput'
import { ListPostsInput, PostSortField, SortDirection } from '@/resolvers/types/ListPostsInput'
import { Post } from '@/resolvers/types/Post'
import { getUserIdFromJwt } from '@/utils/authHelpers'

@Resolver()
export class PostResolver {
  @Mutation(() => String)
  async createPost(
    @Ctx() ctx: Context,
    @Arg('input', () => CreatePostInput) input: CreatePostInput,
  ): Promise<string> {
    const authorUserId = getUserIdFromJwt(ctx)
    const post = await ctx.postService.create(input, authorUserId)
    return post.id
  }

  @Query(() => Post, { nullable: true })
  async findPostById(
    @Ctx() ctx: Context,
    @Arg('id', () => String) id: string
  ): Promise<Post | null> {
    return ctx.postService.findOneById(id)
  }

  @Query(() => [Post])
  async findManyPosts(
    @Ctx() ctx: Context,
    @Arg('input', () => ListPostsInput, { nullable: true }) input?: ListPostsInput
  ): Promise<Post[]> {
    const options: any = {}

    if (input?.search !== undefined) options.search = input.search
    if (input?.skip !== undefined) options.skip = input.skip
    if (input?.take !== undefined) options.take = input.take

    const sortFieldEnum = input?.sortField ?? PostSortField.CreatedAt
    const sortDirectionEnum = input?.sortDirection ?? SortDirection.Desc

    options.sortField = sortFieldEnum as 'createdAt' | 'title'
    options.sortDirection = sortDirectionEnum as 'asc' | 'desc'

    return ctx.postService.findMany(options)
  }
}
