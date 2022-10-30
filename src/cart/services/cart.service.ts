import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { calculateCartTotal } from '../models-rules';
import {v4} from 'uuid';

// Constants
import { CustomResponse } from '../../constants/response';
import { CARTS_REPOSITORY, CART_ITEMS_REPOSITORY, PRODUCTS_REPOSITORY, USERS_REPOSITORY } from '../../constants/database';

// Entities
import { UserEntity } from '../../users/entities/user.entity';
import { CartItemEntity } from '../entities/cart-item.entity';
import { CartEntity } from '../entities/cart.entity';
import { ProductEntity } from '../../products-service/entities/product.entity';

// Utils
import { createResponse } from '../../utils/create-response';
import { isEntityExist } from '../../utils/validation';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { getConnection } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @Inject(CARTS_REPOSITORY)
    private readonly cartRepository: Repository<CartEntity>,
    @Inject(CART_ITEMS_REPOSITORY)
    private readonly cartItemRepository: Repository<CartItemEntity>,
    @Inject(USERS_REPOSITORY)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productRepository: Repository<ProductEntity>
  ) {}

  async findByUserId(userId: string): Promise<CartEntity | null> {
    return this.cartRepository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.items', 'items')
      .leftJoin('cart.user', 'user')
      .where('user.id = :userId', {
        userId: '85ca217f-9f30-470f-b444-6ab03c37adc5'
      })
      .getOne();
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

    const {cart} = getCartResponse.body;

    for await (const item of updateCartDto.items) {
      const checkResponse = await this.checkProductCount(item.productId, item.count);
      
      if (checkResponse) {
        return checkResponse;
      }
    }
    
    const newItems = updateCartDto.items.map(item => ({
      ...item,
        id: v4(),
        cart
    }));
      
    await getConnection().transaction(async manager => {
      await manager.getRepository(CartItemEntity).save(newItems);
        
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

  async removeByUserId(userId: string): Promise<CustomResponse> {
    const user = isEntityExist(await this.userRepository.findOne({
      where: {
        id: '85ca217f-9f30-470f-b444-6ab03c37adc5'
      },
      relations: ['cart']
    }), 'User');

    if (!(user instanceof UserEntity)) {
      return user;
    }

    await getConnection().transaction(async manager => {
      await manager.getRepository(UserEntity).update(user.id, {cart: null});

      await manager.getRepository(CartEntity).delete(user.cart.id);
    })
    
    return {
      statusCode: HttpStatus.OK,
      message: 'OK'
    }
  }
}
