import { Controller, Get, Param, Put, Body } from '@nestjs/common';
// import { BasicAuthGuard, JwtAuthGuard } from '../auth';

// Constants
import { CustomResponse } from '../constants/response';

// DTOs
import { UpdateOrderDto } from './dto/update-order.dto';

// Entities
import { OrderEntity } from './entities/order.entity';

// Services
import { OrderService } from './services';


@Controller('api/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService
  ) {}

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get(':id')
  async findOneById(
    @Param('id') id: string
  ): Promise<CustomResponse & {
    body: OrderEntity
  } | CustomResponse> {
    return this.orderService.findOneById(id);
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<CustomResponse & {
    body: OrderEntity
  } | CustomResponse> {
    return this.orderService.updateOne(id, updateOrderDto);
  }
}
