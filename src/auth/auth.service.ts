import { ConflictException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { DatabaseService } from '../database/database.service.js';
import { AuthDto } from './dto/index.js';

@Injectable()
export class AuthService {
  constructor(private database: DatabaseService) {}

  async signUp(dto: AuthDto) {
    const existingUser = await this.database.db.orm.public.User.where(
      { email: dto.email },
    ).first();

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hash = await argon.hash(dto.password);

    const user = await this.database.db.orm.public.User.select(
      'id',
      'firstName',
      'lastName',
      'email',
      'createdAt',
    ).create({
      email: dto.email,
      hash,
    });

    return user;
  }

  signIn() {
    return { msg: 'I have signed in!' };
  }
}
