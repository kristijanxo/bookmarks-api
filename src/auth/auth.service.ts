import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto.js';
import * as argon from 'argon2';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class AuthService {
  constructor(private database: DatabaseService) {}
  async signUp(dto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);

    // save the new user in db
    const user = await this.database.db.orm.public.User.create({
      email: dto.email,
      hash,
    });

    // return the saved user
    return user;
  }

  signIn() {
    return { msg: 'I have signed in!' };
  }
}
