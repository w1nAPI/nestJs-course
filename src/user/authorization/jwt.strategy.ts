import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../user.service';
import { JwtUserPayload } from './jwt-payload.interface';
import { JwtConfigService } from 'src/config/jwt.config.service';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwtUser') {
  constructor(
    private readonly userService: UserService,
    private readonly jwtConfig: JwtConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.userSecret,
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
