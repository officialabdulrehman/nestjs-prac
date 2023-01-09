import { Field, Int, ObjectType } from "@nestjs/graphql";

export interface IPaginateResult<T> {
  data: T[];
  pagination: IPagination;
}

@ObjectType()
export class IPagination {
  @Field(() => Int)
  perPage: number;

  @Field(() => Int)
  page: number;

  @Field(() => Boolean)
  hasPrevious: boolean;

  @Field(() => Boolean)
  hasNext: boolean;

  @Field()
  next: string;

  @Field()
  previous: string;
}