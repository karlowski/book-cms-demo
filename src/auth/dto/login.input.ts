import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(() => String, { description: 'Email field' })
  email: string;

  @Field(() => String, { description: 'Password field' })
  password: string;
}
