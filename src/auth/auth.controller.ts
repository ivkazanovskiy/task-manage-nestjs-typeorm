import {
  Body,
  ConsoleLogger,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  private ConsoleLogger = new ConsoleLogger('AuthController');
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.singIn(authCredentialsDto);
  }

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Get('test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    this.ConsoleLogger.debug(typeof this.configService.get('DB_PORT'));
    // after token validation JwtStrategy.validate provide req.user with some information
    return req.user;
  }
}
