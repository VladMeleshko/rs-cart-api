import { Provider } from '@nestjs/common';
import { CartItemEntity } from '../cart/entities/cart-item.entity';
import { CartEntity } from '../cart/entities/cart.entity';
import { ProductEntity } from '../products-service/entities/product.entity';
import { UserEntity } from '../users/entities/user.entity';
import { Connection, createConnection } from 'typeorm';
import { DATABASE_CONNECTION } from '../constants/database';
import { StockEntity } from '../products-service/entities/stock.entity';

export const databaseProviders: Provider[] = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (): Promise<Connection> => {
      return createConnection({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: +process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        schema: process.env.POSTGRES_SCHEMA,
        logging: false,
        entities: [CartEntity, CartItemEntity, UserEntity, ProductEntity, StockEntity],
        synchronize: false
      });
    }
  }
];

