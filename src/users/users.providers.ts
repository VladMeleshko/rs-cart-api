import { Connection } from "typeorm";

// Constants
import { DATABASE_CONNECTION, USERS_REPOSITORY } from "../constants/database";

// Entities
import { UserEntity } from "./entities/user.entity";

export const usersProviders = [
  {
    provide: USERS_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(UserEntity),
    inject: [DATABASE_CONNECTION]
  }
]