import { Module } from '@nestjs/common';

// Modules
import { DatabaseModule } from '../database/database.module';

// Controllers
import { UsersController } from './users.controller';

// Providers
import { usersProviders } from './users.providers';

// Services
import { UsersService } from './services';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService]
})
export class UsersModule {}
