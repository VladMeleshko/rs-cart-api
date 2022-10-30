import { CARTS_REPOSITORY, CART_ITEMS_REPOSITORY, DATABASE_CONNECTION, PRODUCTS_REPOSITORY, USERS_REPOSITORY } from "../constants/database";
import { Connection } from "typeorm";
import { UserEntity } from "../users/entities/user.entity";
import { CartEntity } from "./entities/cart.entity";
import { CartItemEntity } from "./entities/cart-item.entity";
import { ProductEntity } from "../products-service/entities/product.entity";

export const cartsProviders = [
  {
    provide: CARTS_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(CartEntity),
    inject: [DATABASE_CONNECTION]
  },
  {
    provide: CART_ITEMS_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(CartItemEntity),
    inject: [DATABASE_CONNECTION]
  },
  {
    provide: USERS_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(UserEntity),
    inject: [DATABASE_CONNECTION]
  },
  {
    provide: PRODUCTS_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(ProductEntity),
    inject: [DATABASE_CONNECTION]
  }
]