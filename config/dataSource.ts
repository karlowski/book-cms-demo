import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { entities } from '../src/entities/entities.module';

export const dataSource = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('POSTGRESQL_HOST'),
    port: configService.get<number>('POSTGRESQL_PORT'),
    username: configService.get<string>('POSTGRESQL_USER'),
    password: configService.get<string>('POSTGRESQL_PASSWORD'),
    database: configService.get<string>('POSTGRESQL_DB'),
    entities,
    synchronize: false,
    cache: true,
    timezone: 'Z',
    logging: false
  }),
});

