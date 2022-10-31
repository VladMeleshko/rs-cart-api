import { Module } from '@nestjs/common';

// Modules
import { DatabaseModule } from '../database/database.module';

// Controllers
import { OrderController } from './order.controller';

// Providers
import { ordersProviders } from './order.providers';

// Services
import { OrderService } from './services';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [OrderService, ...ordersProviders],
  exports: [OrderService]
})
export class OrderModule {}
