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

        return {
          type: 'postgres',
          url: dbUrl, //  let TypeORM parse DATABASE_URL for you
          autoLoadEntities: true,
          synchronize: true, // ⚠️ dev only, turn off in production
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
