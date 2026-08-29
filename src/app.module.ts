import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { BookmarkModule } from './bookmark/bookmark.module.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [AuthModule, UserModule, BookmarkModule, DatabaseModule],
})
export class AppModule {}
