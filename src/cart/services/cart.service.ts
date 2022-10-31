import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { Repository, getConnection } from 'typeorm';
import { calculateCartTotal } from '../models-rules';
import {v4} from 'uuid';
import { EntityManager } from 'typeorm';

// Constants
import { CustomResponse } from '../../constants/response';
import { CARTS_REPOSITORY, PRODUCTS_REPOSITORY, USERS_REPOSITORY } from '../../constants/database';

// DTOs
import { UpdateCartDto } from '../dto/update-cart.dto';
import { AdditionalOrderInfoDto } from '../../order/dto/additional-order-info.dto';

// Entities
import { UserEntity } from '../../users/entities/user.entity';
import { CartItemEntity } from '../entities/cart-item.entity';
import { CartEntity } from '../entities/cart.entity';
import { ProductEntity } from '../../products-service/entities/product.entity';
import { OrderEntity } from '../../order/entities/order.entity';

// Utils
import { createResponse } from '../../utils/create-response';
import { isEntityExist } from '../../utils/validation';

// Services
import { OrderService } from '../../order';

@Injectable()
export class CartService {
  constructor(
    @Inject(CARTS_REPOSITORY)
    private readonly cartRepository: Repository<CartEntity>,
    @Inject(USERS_REPOSITORY)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly orderService: OrderService
  ) {}

  async findByUserId(userId: string): Promise<CartEntity | null> {
    const cart = await this.cartRepository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.items', 'items')
      .leftJoin('cart.user', 'user')
      .where('user.id = :userId', {
        userId: '85ca217f-9f30-470f-b444-6ab03c37adc5'
      })
      .getOne();

    if (cart) {
      const items = [];

      for await (const item of cart.items) {
        const product = await this.productRepository.findOne({
          where: {
            id: item.productId
          },
          relations: ['stock']
        });

        items.push({...item, product: {...product, count: product.stock.count}});
      }

      return {...cart, items};
    }

    return cart;
  }

  async createByUserId(userId: string): Promise<CartEntity | CustomResponse> {
    const user = isEntityExist(await this.userRepository.findOne({
      where: {
        id: '85ca217f-9f30-470f-b444-6ab03c37adc5'
      }
    }), 'User');

    if (!(user instanceof UserEntity)) {
      return user;
    }

    const creationDate = new Date();

    const id = v4();
    await this.cartRepository.save({
      id,
      user, 
      createdAt: creationDate,
      updatedAt: creationDate
    });

    return this.cartRepository.findOne({
      where: {
        id
      }
    });
  }

  async prepareFullCartItemsInfoAndCalculateTotalPrice(userCart: CartEntity) {
    const userCartItemsWithProductInfo = []

      if (userCart.items && userCart.items.length) {
        for await (const item of userCart.items) {
          const product = await this.productRepository.findOne({
            where: {
              id: item.productId
            }
          })
          userCartItemsWithProductInfo.push({...item, product});
        }
      }

    return calculateCartTotal(userCartItemsWithProductInfo);
  }

  async findOrCreateByUserId(userId: string): Promise<CustomResponse & {
    body: {
      cart: CartEntity,
      total: number
    }
  } | CustomResponse> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      const totalCartItemPrice = await this.prepareFullCartItemsInfoAndCalculateTotalPrice(userCart);

      return createResponse(HttpStatus.OK, 'OK', {
        cart: userCart,
        total: totalCartItemPrice
      });
    }

    const createdCart = await this.createByUserId(userId);

    if (createdCart instanceof CartEntity) {
      const totalCartItemPrice = await this.prepareFullCartItemsInfoAndCalculateTotalPrice(createdCart);

      return createResponse(HttpStatus.CREATED, 'Cart has been created', {
        cart: createdCart,
        total: totalCartItemPrice
      });
    } else {
      return createdCart;
    }
  }

  async checkProductCount(productId: string, itemCount: number): Promise<CustomResponse | void> {
    const product = isEntityExist(await this.productRepository.findOne({
      where: {
        id: productId
      },
      relations: ['stock']
    }), 'Product');

    if (!(product instanceof ProductEntity)) {
      return product;
    }

    if (product.stock.count < itemCount) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: `You can't buy '${product.title}' books more than ${product.stock.count}`
      };
    }
  }

  async updateByUserId(userId: string, updateCartDto: UpdateCartDto) {
    const getCartResponse = await this.findOrCreateByUserId(userId) as CustomResponse & {body: {cart: CartEntity, total: number}};

    if (!getCartResponse.body) {
      return getCartResponse;
    }

    const {cart} = getCartResponse.body;

    const checkResponse = await this.checkProductCount(updateCartDto.productId, updateCartDto.count);
      
    if (checkResponse) {
      return checkResponse;
    }
      
    const item = cart.items.find(i => i.productId === updateCartDto.productId);

    await getConnection().transaction(async manager => {
      if (item) {
        await manager.getRepository(CartItemEntity).update(item.id, {count: updateCartDto.count});  
      } else {
        await manager.getRepository(CartItemEntity).save({
          ...updateCartDto,
          id: v4(),
          cart
        });
      }
        
      await manager.getRepository(CartEntity).update(cart.id, {updatedAt: new Date()});
    });
      
    const updatedCart = await this.cartRepository.findOne({
      where: {
        id: cart.id
      },
      relations: ['items']
    });
  
    const totalCartItemPrice = await this.prepareFullCartItemsInfoAndCalculateTotalPrice(updatedCart);
      
    return createResponse(HttpStatus.OK, 'OK', {
      cart: totalCartItemPrice,
      total: totalCartItemPrice
    });
  }

  async remove(manager: EntityManager, userId: string): Promise<CustomResponse> {
    const user = await manager.getRepository(UserEntity).findOne({
      where: {
        id: '85ca217f-9f30-470f-b444-6ab03c37adc5'
      },
      relations: ['cart', 'cart.items']
    });

    if (user.cart.items.length) {
      const cartItemIds = user.cart.items.map(item => item.id);
  
      await manager.getRepository(CartItemEntity).delete(cartItemIds);
    }
    
    return {
      statusCode: HttpStatus.OK,
      message: 'OK'
    }
  }

  async removeByUserId(
    userId: string,
    manager?: EntityManager
    ): Promise<CustomResponse> {
    if (manager) {
      return this.remove(manager, userId);
    } else {
      return getConnection().transaction(async manager => {
        return this.remove(manager, userId);
      })
    }
  }

  async checkout(
    userId: string,
    additionalOrderInfoDto: AdditionalOrderInfoDto
  ): Promise<CustomResponse & {
    body: OrderEntity
  } | CustomResponse> {
    const cart = await this.findByUserId(userId);

    if (!(cart || cart.items.length)) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Cart is empty',
      }
    }

    const total = await this.prepareFullCartItemsInfoAndCalculateTotalPrice(cart);

    return getConnection().transaction(async (manager: EntityManager) => {
      const order = await this.orderService.createOne(manager, {
        ...additionalOrderInfoDto,
        items: cart.items,
        userId,
        total
      });

      await this.removeByUserId(userId);

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { order }
      }
    });
  }
}
