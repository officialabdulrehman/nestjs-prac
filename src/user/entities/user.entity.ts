import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IPagination } from '../../dao/pagination';
import { DTO } from '../../datamodels/dto';

@ObjectType()
export class User extends DTO {
  @Field()
  name: string = null

  @Field(() => Int, { description: 'Example field (placeholder)' })
  age: number = null
}


@ObjectType()
export class UserPaginated {
  @Field(() => [User])
  data: User[]

  @Field(() => IPagination)
  pagination: IPagination
}
