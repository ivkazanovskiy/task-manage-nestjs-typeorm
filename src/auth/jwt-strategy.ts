import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { IJwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private userRepository: typeof UserRepository & Repository<User>;
  constructor(@InjectRepository(User) baseRepository: Repository<User>) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    this.userRepository = baseRepository.extend(UserRepository);
  }

  // special name used for 'AuthGuard()'
  async validate(payload: IJwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new UnauthorizedException();
    }
    delete user.password;
    // add this to req.user (it doesn't depends on naming. it always req.user)
    return user;
  }
}
