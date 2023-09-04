import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from '../user/dto';
import { UserVerificationService } from './services/user-verification.service';
import { CommonVerifyUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userVerificationService: UserVerificationService
  ) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.log({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req.user);
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/common-verify')
  async commonVerifyUser(@Query() query: CommonVerifyUserDto): Promise<any> {
    return this.userVerificationService.commonVerifyUser(query.token)
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: any): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  credentialsLogin(@Req() req: any) {
    return this.authService.loginWithCredentials(req.user);
  }

  @Post('register')
  register(@Body() registerUser: CreateUserDto) {
    return this.authService.register(registerUser);
  }
}
