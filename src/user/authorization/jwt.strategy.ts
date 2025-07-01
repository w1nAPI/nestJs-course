import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../user.service';
import { JwtUserPayload } from './jwt-payload.interface';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwtUser') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.USER_JWT_SECRET,
    });
  }
  async validate(payload: JwtUserPayload) {
    const user = await this.userService.getFullInfo(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.ban) {
      throw new UnauthorizedException();
    }
    return { sub: payload.sub };
  }
}
