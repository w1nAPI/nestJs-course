import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserService } from '../user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.USER_JWT_SECRET,
    });
  }
  async validate(payload: JwtPayload) {
    const user = await this.userService.getFullInfo(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.ban) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
