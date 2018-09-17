import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private error: any;

  setError(error) {
    this.error = error;
  }

  getError(): any {
    return this.error;
  }

  hasError(): boolean {
    return !!this.error;
  }
}
