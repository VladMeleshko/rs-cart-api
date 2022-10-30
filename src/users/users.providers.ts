import { DATABASE_CONNECTION, USERS_REPOSITORY } from "../constants/database";
import { Connection } from "typeorm";
import { UserEntity } from "./entities/user.entity";

export const usersProviders = [
  {
    provide: USERS_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(UserEntity),
    inject: [DATABASE_CONNECTION]
  }
]