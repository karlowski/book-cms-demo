import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { SignUpInput } from './dto/sign-up.input';
import { AuthLoginResponseDto } from './dto/auth-login-response.dto';


@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Mutation(() => AuthLoginResponseDto)
  public async login(@Args('input') input: LoginInput): Promise<AuthLoginResponseDto> {
    return this.authService.login(input);
  }

  @Mutation(() => AuthLoginResponseDto)
  public async signUp(@Args('input') input: SignUpInput): Promise<AuthLoginResponseDto> {
    return this.authService.signUp(input);
  }

  @Mutation(() => AuthLoginResponseDto)
  public async refresh(@Args('token', { type: () => String }) token: string): Promise<AuthLoginResponseDto> {
    return this.authService.refreshAccessToken(token);
  }

  @Mutation()
  public async logout(@Args('id', { type: () => Int }) id: number): Promise<void> {
    return this.authService.logout(id);
  }
}
