import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private error: any;

  setError(type: string, error: Error) {
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
