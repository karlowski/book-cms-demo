import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { CommonServiceModule } from '../common/services/common-service.module';
import { EntitiesModule } from '../entities/entities.module';


@Module({
  imports: [
    EntitiesModule, 
    CommonServiceModule,
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
  ],
  providers: [BookResolver, BookService],
})
export class BookModule {}
