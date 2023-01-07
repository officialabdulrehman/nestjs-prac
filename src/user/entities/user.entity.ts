import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  name: string

  @Field(() => Int, { description: 'Example field (placeholder)' })
  age: number;
}
