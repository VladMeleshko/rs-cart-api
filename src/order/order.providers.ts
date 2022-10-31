import { Connection } from "typeorm";

// Constants
import { DATABASE_CONNECTION, ORDERS_REPOSITORY } from "../constants/database";

// Entities
import { OrderEntity } from "./entities/order.entity";

export const ordersProviders = [
  {
    provide: ORDERS_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(OrderEntity),
    inject: [DATABASE_CONNECTION]
  }
]