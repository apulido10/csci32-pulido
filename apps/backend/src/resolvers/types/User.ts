import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class User {
  @Field(() => String)
  user_id!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  email!: string
}
