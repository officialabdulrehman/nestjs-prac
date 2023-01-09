import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class DTO {
  @Field()
  id: string = null

  @Field()
  updatedAt: Date = null

  @Field()
  createdAt: Date = null
}

export type DTOCreate<T> = Omit<T, keyof DTO>


export type DTOPatch<T> = Partial<DTOCreate<T>>