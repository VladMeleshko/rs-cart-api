import { Controller, Get, Delete, Put, Body, Req, Post, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../auth';

// DTOs
import { UpdateCartDto } from './dto/update-cart.dto';
import { AdditionalOrderInfoDto } from '../order/dto/additional-order-info.dto';

// Constants
import { CustomResponse } from '../constants/response';

// Entities
import { CartEntity } from './entities/cart.entity';
import { OrderEntity } from '../order/entities/order.entity';

// Services
import { CartService } from './services';

// Shared
import { AppRequest, getUserIdFromRequest } from '../shared';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest): Promise<CustomResponse & {
    body: {
      cart: CartEntity,
      total: number
    }
  } | CustomResponse> {
    return this.cartService.findOrCreateByUserId(getUserIdFromRequest(req));
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(
    @Req() req: AppRequest,
    @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateByUserId(getUserIdFromRequest(req), updateCartDto)
  }

  @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest): Promise<CustomResponse> {
    return this.cartService.removeByUserId(getUserIdFromRequest(req));
  }

  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(
    @Req() req: AppRequest,
    @Body() additionalOrderInfoDto: AdditionalOrderInfoDto
    ): Promise<CustomResponse & {
      body: OrderEntity
    } | CustomResponse> {
    return this.cartService.checkout(getUserIdFromRequest(req), additionalOrderInfoDto);
  }
}
