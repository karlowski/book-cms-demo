import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthLoginResponseDto {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

