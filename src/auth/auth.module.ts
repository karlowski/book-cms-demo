import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthRedisService } from './auth-redis.service';
import { EntitiesModule } from '../entities/entities.module';
import { CommonServiceModule } from '../common/services/common-service.module';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('ACCESS_TOKEN_SECRET'),
        signOptions: { 
          expiresIn: configService.get('ACCESS_TOKEN_EXP') 
        },
      }),
      inject: [ConfigService]
    }),
    EntitiesModule,
    CommonServiceModule
  ],
  providers: [
    AuthResolver, 
    AuthService, 
    AuthRedisService,
    JwtStrategy
  ]
})
export class AuthModule {}
