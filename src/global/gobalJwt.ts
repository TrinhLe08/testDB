import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
constructor(private readonly configService: ConfigService) {}

  sign(payload: any): string {
    return jwt.sign(payload, this.configService.get<string>('JWT_SECRET_KEY'), { expiresIn: '10m' });
  }

  verify(token: string) {
    return jwt.verify(token, this.configService.get<string>('JWT_SECRET_KEY'));
  }
}
