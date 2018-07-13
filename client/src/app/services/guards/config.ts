import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ConfigService } from '@services/config';

@Injectable()
export class NeedConfigGuardService implements CanActivate {
  constructor(public config: ConfigService, public router: Router) { }
  canActivate(): boolean {
    return !this.config.isConfigured;
  }
}
