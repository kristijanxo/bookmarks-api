import { Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Req() req: Request) {
    console.log(req.body);
    return this.authService.signUp();
  }

  @Post('sign-in')
  signIn() {
    return this.authService.signIn();
  }
}
