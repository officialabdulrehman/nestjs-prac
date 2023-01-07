import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DTO } from '../../datamodels/dto';

@ObjectType()
export class User extends DTO {
  @Field()
  id: string;

  @Field()
  name: string

  @Field(() => Int, { description: 'Example field (placeholder)' })
  age: number;
}
