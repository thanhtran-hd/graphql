import { Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class PaginationArgs {
  @Field((_type) => Int, { nullable: true })
  @Min(0)
  skip: number;

  @Field((_type) => Int, { nullable: true })
  @Min(1)
  @Max(50)
  take: 25;
}
