import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { RedisSharedService } from '../common/services/redis-shared.service';
import { SignUpInput } from './dto/sign-up.input';
import { AuthLoginResponseDto } from './dto/auth-login-response.dto';
import { LoginInput } from './dto/login.input';
import { IJwtPayload } from '../common/interfaces/jwt-payload.interface';
import { AuthRedisService } from './auth-redis.service';
import { PermissionsEnum } from '../common/enums/permissions.enum';
import { Role } from '../entities/role.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Role) private readonly _roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    private readonly _authRedisService: AuthRedisService,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
    private readonly _redisSharedService: RedisSharedService
  ) {}

  public async validateUser(email: string, pass: string): Promise<Partial<User>> {
    const user = await this._userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) {
      throw new UnauthorizedException('Bad credentials');
    }

    const match = await bcrypt.compare(pass, user.password);
    if (!match) {
      throw new UnauthorizedException('Bad credentials');
    }

    const { password: _, ...userData } = user;
    return userData;
  }

  public async signUp(signUpDto: SignUpInput): Promise<AuthLoginResponseDto> {
    const { email, password } = signUpDto;
    const user = await this._userRepository.findOneBy({ email });

    if (user) {
      throw new ConflictException();
    }

    const saltRounds = Number(this._configService.get<number>('PASSWORD_SALT_ROUNDS'));
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userEntity = this._userRepository.create({
      ...signUpDto,
      password: hashedPassword,
      roles: [],
    });

    const userRole = await this._roleRepository.findOne({
      where: { title: 'user' },
      relations: ['permissions'],
    });

    if (!userRole) {
      throw new Error('Default role "user" not found');
    }

    userEntity.roles = [userRole];

    await this._userRepository.save(userEntity);

    return this.login({ email, password });
  }

  public async login(loginDto: LoginInput): Promise<AuthLoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const permissions = user.roles?.flatMap(role => role.permissions.map(p => p.title)) as PermissionsEnum[];

    const tokens = await this._generateTokens({ 
      userId: user.id as number,
      permissions
    });
    await this._authRedisService.saveRefreshToken(user.id as number, tokens.refreshToken)

    return tokens;
  }

  public async refreshAccessToken(token: string): Promise<AuthLoginResponseDto> {
    let payload: IJwtPayload;
    
    try {
      payload = this._jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token is invalid');
    }

    const storedToken = await this._authRedisService.getRefreshToken(payload.userId);
    if (!storedToken || storedToken !== token) {
      throw new UnauthorizedException('Token is invalid');
    }

    const refreshedTokens = await this._generateTokens(payload);
    await this._authRedisService.saveRefreshToken(payload.userId, refreshedTokens.refreshToken);

    return refreshedTokens;
  }

  public async logout(userId: number): Promise<void> {
    return this._authRedisService.revokeRefreshToken(userId);
  }

  private async _generateTokens(payload: IJwtPayload): Promise<AuthLoginResponseDto> {
    const accessSecret = this._configService.get('ACCESS_TOKEN_SECRET');
    const refreshSecret = this._configService.get('REFRESH_TOKEN_SECRET');
    const accessExpiresIn = this._configService.get('ACCESS_TOKEN_EXP');
    const refreshExpiresIn = this._configService.get('REFRESH_TOKEN_EXP');
    const refreshTtl = Number(this._configService.get('REFRESH_TOKEN_TTL'));

    const accessToken = this._jwtService.sign(payload, { 
      secret: accessSecret, 
      expiresIn: accessExpiresIn 
    });
    const refreshToken = this._jwtService.sign(payload, { 
      secret: refreshSecret, 
      expiresIn: refreshExpiresIn 
    });

    await this._redisSharedService.set(`refresh:${payload.userId}`, refreshToken, refreshTtl);

    return { accessToken, refreshToken };
  }
}
