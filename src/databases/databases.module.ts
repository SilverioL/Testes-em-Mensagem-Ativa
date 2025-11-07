import { Module } from '@nestjs/common';
import { MongodbModule } from './mongodb/mongodb.module';

@Module({
  providers: [],
  imports: [MongodbModule],
})
export class DatabasesModule {}
