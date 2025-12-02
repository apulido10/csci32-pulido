import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class Comment {
  @Field(() => String)
  id!: string

  @Field(() => String)
  body!: string

  @Field(() => String)
  postId!: string
}
