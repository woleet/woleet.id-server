import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface KeyObject {
  name: string
}

@Injectable()
export class KeyService {

  constructor() { }

  getById(keyId: string) {

  }

  getByUser(userId: string) {

  }

  getAll() {

  }

  add(userId: string, key: KeyObject) {

  }

  edit(keyId: string, key: KeyObject) {

  }

  revoke(keyId: string) {

  }

}
