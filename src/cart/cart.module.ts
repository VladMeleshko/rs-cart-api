import { Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { CartController } from './cart.controller';
import { CartService } from './services';
import { DatabaseModule } from '../database/database.module';
import { cartsProviders } from './cart.providers';


@Module({
  imports: [
    DatabaseModule,
    OrderModule
  ],
  providers: [CartService, ...cartsProviders],
  controllers: [CartController]
})
export class CartModule {}
