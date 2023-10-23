import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import JwtAuthGuard from './guards/jwt.guard';

import { AuthService } from './auth.service';
import {
  RegisterRequestBody,
  AuthenticateRequestBody,
  ConfirmEmailRequestBody,
  ProfileRequestBody,
} from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerRequest: RegisterRequestBody) {
    try {
      return await this.authService.register(registerRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('authenticate')
  async authenticate(@Body() authenticateRequest: AuthenticateRequestBody) {
    try {
      return await this.authService.authenticate(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('confirm-email')
  async confirmEmail(@Body() confirmEmailRequest: ConfirmEmailRequestBody) {
    try {
      return await this.authService.confirmEmail(confirmEmailRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Body() profileRequest: ProfileRequestBody) {
    try {
      return await this.authService.profile(profileRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
