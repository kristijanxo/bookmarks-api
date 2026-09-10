import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
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

    const user = await this.database.db.orm.public.User.create({
      email: dto.email,
      hash,
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async signIn(dto: AuthDto) {
    //find user by email
    //if user does not exist throw exception
    const user = await this.database.db.orm.public.User.where({
      email: dto.email,
    }).first();

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    //compare password
    //if passord false trhow exception
    const pwMatches = await argon.verify(user.hash, dto.password);

    if (!pwMatches) {
      throw new ForbiddenException('Invalid credentials');
    }

    //send back user
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
