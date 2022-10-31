import {Module} from '@nestjs/common';

// Providers
import {databaseProviders} from './database.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders]
})
export class DatabaseModule {}
