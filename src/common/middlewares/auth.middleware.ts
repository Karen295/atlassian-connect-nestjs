import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AtlassianConnectService } from '../../modules/atlassian-connect/atlassian-connect.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly as: AtlassianConnectService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const addOnAuthenticationMiddleware = this.as.getInstance().authenticate();
    addOnAuthenticationMiddleware(req, res, next);
    console.log('Request...');
  }
}
