import { FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import * as traverse from 'traverse';
import { BehaviorSubject } from 'rxjs';

export class TrackById {

  trackById(index: number, item: { id: string }) {
    return item.id;
  }

}

export class Lock {
  private _lock = 0;
  private _lock$: BehaviorSubject<boolean>;

  constructor() {
    this._lock$ = new BehaviorSubject(false);
  }

  incr() {
    this._lock$.next(!!++this._lock);
  }

  decr() {
    this._lock$.next(!!--this._lock);
  }

  isLocked() {
    return this._lock;
  }

  asObservable() {
    return this._lock$.asObservable();
  }
}

export function urlValidator(control: AbstractControl): ValidationErrors | null {
  const str: string = control.value;

  if (!str) {
    return;
  }

  if (!/^https?.*/.test(str)) {
    return ({ url: { message: 'invalid or missing protocol (http or https)' } });
  }

  try {
    // tslint:disable-next-line:no-unused-expression
    new window.URL(str);
  } catch (err) {
    return ({ url: { message: 'must be a valid uri' } });
  }

  return null;
}

export function secureUrlValidator(control: AbstractControl): ValidationErrors | null {
  const str: string = control.value;

  if (!str) {
    return;
  }

  if (!/^https.*/.test(str)) {
    return ({ url: { message: 'invalid or missing protocol (https)' } });
  }

  try {
    // tslint:disable-next-line:no-unused-expression
    new window.URL(str);
  } catch (err) {
    return ({ url: { message: 'must be a valid uri' } });
  }

  return null;
}

export function endValidator(expectedEnd: string) {
  return function (control: AbstractControl): ValidationErrors | null {
    const str: string = control.value;

    if (!str) {
      return;
    }

    if (!str.endsWith(expectedEnd)) {
      return ({ end: { expectedEnd } });
    }

    return null;
  };
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
      case 'safeWord':
        return 'Must only contain letters, numbers, hyphens and underscores';
      case 'password':
        return `Must contain at least ${error.missing}`;
      case 'url':
        return `Invalid url: ${error.message}`;
      case 'end':
        return `Expect string to end with "${error.expectedEnd}"`;
      case 'ascii':
        return `Must contain only ascii characters`;
      case 'startsWithALetter':
        return `Must start with a letter`;
      default:
        return '';
    }
  }
}

export function confirm(message) {
  return window.confirm(message);
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
