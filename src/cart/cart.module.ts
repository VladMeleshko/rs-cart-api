import { Module } from '@nestjs/common';

// Modules
import { OrderModule } from '../order/order.module';
import { DatabaseModule } from '../database/database.module';

// Controllers
import { CartController } from './cart.controller';

// Providers
import { cartsProviders } from './cart.providers';

// Services
import { CartService } from './services';


@Module({
  imports: [
    DatabaseModule,
    OrderModule
  ],
  providers: [CartService, ...cartsProviders],
  controllers: [CartController]
})
export class CartModule {}
