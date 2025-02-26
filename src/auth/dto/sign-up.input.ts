import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class SignUpInput {
  @Field(() => String, { description: 'Email field' })
  email: string;

  @Field(() => String, { description: 'Password field' })
  password: string;

  @Field(() => String, { description: 'Name field (optional)', nullable: true })
  name?: string;

  @Field(() => String, { description: 'Last name field (optional)', nullable: true })
  lastName?: string;
}
