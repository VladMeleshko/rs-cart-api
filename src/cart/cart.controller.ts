import { Controller, Get, Delete, Put, Body, Req, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { CustomResponse } from '../constants/response';

// import { BasicAuthGuard, JwtAuthGuard } from '../auth';

// Constants
import { AppRequest, getUserIdFromRequest } from '../shared';

// Entities
import { CartEntity } from './entities/cart.entity';

// Services
import { OrderService } from '../order';
import { CartService } from './services';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) {}

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest): Promise<CustomResponse & {
    body: {
      cart: CartEntity,
      total: number
    }
  } | CustomResponse> {
    return this.cartService.findOrCreateByUserId(getUserIdFromRequest(req));
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(
    @Req() req: AppRequest,
    @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateByUserId(getUserIdFromRequest(req), updateCartDto)
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest): Promise<CustomResponse> {
    return this.cartService.removeByUserId(getUserIdFromRequest(req));
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  // @Post('checkout')
  // checkout(@Req() req: AppRequest, @Body() body) {
  //   const userId = getUserIdFromRequest(req);
  //   const cart = this.cartService.findByUserId(userId);

  //   if (!(cart && cart.items.length)) {
  //     const statusCode = HttpStatus.BAD_REQUEST;
  //     req.statusCode = statusCode

  //     return {
  //       statusCode,
  //       message: 'Cart is empty',
  //     }
  //   }

  //   const { id: cartId, items } = cart;
  //   const total = calculateCartTotal(cart);
  //   const order = this.orderService.create({
  //     ...body, // TODO: validate and pick only necessary data
  //     userId,
  //     cartId,
  //     items,
  //     total,
  //   });
  //   this.cartService.removeByUserId(userId);

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'OK',
  //     data: { order }
  //   }
  // }
}
