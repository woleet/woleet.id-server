import { FormControl } from '@angular/forms';
import * as traverse from 'traverse';

export class TrackById {

  trackById(index: number, item: { id: string }) {
    return item.id;
  }

}

export class ErrorMessageProvider {
  getErrorMessage(field: FormControl) {
    const errorName = field.errors && Object.keys(field.errors)[0];
    const error = field.errors[errorName];

    switch (errorName) {
      case 'required':
        return 'You must enter a value';
      case 'minlength':
        return `'Must be at least ${error.requiredLength} character long`;
      case 'maxlength':
        return `Must be at most ${error.requiredLength} character long`;
      case 'email':
        return 'Must be a valid email';
      case 'noSpace':
        return 'Must not contain space';
      case 'uppercaseOnly':
        return 'Must only contain uppercase letters';
      case 'lettersOnly':
        return 'Must only contain letters';
      default:
        return '';
    }
  }
}

export function cleanupObject(obj) {
  return traverse(obj).map(function (e) {
    // if e is falsy, or is an empty object, we delete if, exept for zero
    if ((!e || Object.keys(e).length === 0 && e.constructor === Object) && e !== 0) {
      return void this.delete(false);
    }

    return e;
  });
}

export function replaceInObject(obj, target, repl) {
  return traverse(obj).map(function (e) {
    if (e === target) {
      this.update(repl, false);
    }
  });
}


