import { Injectable } from '@angular/core';
import * as log from 'loglevel';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private error: any;

  setError(type: string, error: Error) {
    log.error('Error set to', type, error);
    this.error = error;
    this.error.type = type;
  }

  getError(): any {
    return this.error;
  }

  hasError(): boolean {
    return !!this.error;
  }
}
