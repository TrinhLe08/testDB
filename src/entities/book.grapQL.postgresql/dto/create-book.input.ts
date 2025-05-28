import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBookInputGragQL {
  @Field()
  title: string;

  @Field()
  author: string;

  @Field({ nullable: true })
  description?: string;
}