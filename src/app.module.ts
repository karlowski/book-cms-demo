import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { AuthorModule } from './author/author.module';
import { AuthModule } from './auth/auth.module';
import { entities } from './entities/entities.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', 'config', '.env'),
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log(join(__dirname, '..', 'config', '.env'));
        console.log('PASSWORD: ', configService.get<string>('POSTGRES_PASSWORD')); 
        return {
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities,
        synchronize: false,
        cache: true,
        timezone: 'Z',
        logging: false
      }},
    }),
    BookModule,
    AuthorModule,
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
