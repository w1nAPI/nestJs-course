import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from '../admin.service';
import { JwtAdminPayload } from './jwt-payload.interface';
import { JwtConfigService } from 'src/config/jwt.config.service';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwtAdmin') {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtConfig: JwtConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.adminSecret,
    });
  }
  async validate(payload: JwtAdminPayload) {
    await this.adminService.findById(payload.sub);
    return { sub: payload.sub };
  }
}
