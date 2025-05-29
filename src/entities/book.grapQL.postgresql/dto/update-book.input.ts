import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateBookInputGragQL {
  @Field()
  title: string;

  @Field()
  author: string;

  @Field({ nullable: true })
  description?: string;
}