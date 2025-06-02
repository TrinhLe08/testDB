import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { JwtService } from 'src/global/gobalJwt';

@Injectable()
export class CheckTokenMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ header (Bearer token)

    if (!token) {
      return res.status(HttpStatus.ERROR).json(
        new ResponseData<string>(
          'Missing Token!',
          HttpStatus.ERROR,
          HttpMessage.ERROR,
        ),
      );
    }

    try {
      const decoded = this.jwtService.verify(token); 
      req['user'] = decoded; // Gán thông tin user vào request
      next();
    } catch (error) {
      return res.status(HttpStatus.ERROR).json(
        new ResponseData<string>(
          'Invalid Token!',
          HttpStatus.ERROR,
          HttpMessage.ERROR,
        ),
      );
    }
  }
}