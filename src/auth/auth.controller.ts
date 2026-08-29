import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { AuthDto } from './dto/';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() dto: AuthDto) {
    console.log({
      dto,
    });
    return this.authService.signUp();
  }

  @Post('sign-in')
  signIn() {
    return this.authService.signIn();
  }
}
