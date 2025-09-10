import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),


    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
    }),


    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
          throw new Error('DATABASE_URL environment variable is not set');
        }
        // Parse DATABASE_URL manually or use a library
        // DATABASE_URL format: mysql://user:password@host:port/dbname
        const regex = /mysql:\/\/(.*):(.*)@(.*):(\d+)\/(.*)/;
        const match = dbUrl.match(regex);
        if (!match) {
          throw new Error('Invalid DATABASE_URL format');
        }
        const [, username, password, host, port, database] = match;
        return {
          type: 'mysql',
          host,
          port: Number(port),
          username,
          password,
          database,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // For dev only, auto create tables
        };
      },
    }),
    ProductsModule,
    OrdersModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
