import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BookGragQLPostgresQL {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  author: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt: Date;
}