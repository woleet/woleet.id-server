import { Injectable } from '@angular/core';
import * as log from 'loglevel';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  get(key: string) {
    return window.localStorage.getItem(key);
  }

  set(key: string, val: string) {
    window.localStorage.setItem(key, val);
  }

  del(key) {
    window.localStorage.removeItem(key);
  }

  clear() {
    window.localStorage.clear();
  }
}
