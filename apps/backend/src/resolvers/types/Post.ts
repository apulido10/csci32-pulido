import { Field, ObjectType } from 'type-graphql'
import { Comment } from './Comment'

@ObjectType()
export class Post {
  @Field(() => String)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  body!: string

  @Field(() => [Comment])
  comments!: Comment[]
}
