import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserResolver } from './user.resolver';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UserResolver, UserService]
})
export class UserModule { }
