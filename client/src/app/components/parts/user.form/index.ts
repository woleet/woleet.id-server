import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '@services/user';
import { Router } from '@angular/router';
import copy from 'deep-copy';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ErrorMessageProvider, replaceInObject } from '@components/util';
import * as traverse from 'traverse';
import cc from '@components/cc';

function asciiValidator(control: AbstractControl): ValidationErrors | null {
  const str: string = control.value;
  if (str && !/^[\x00-\x7F]*$/.test(str)) {
    return ({ ascii: true });
  }

  return null;
}

function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const str: string = control.value;

  if (str && !/.*[0-9].*/.test(str)) {
    return ({ password: { missing: 'one number' } });
  }

  if (str && !/.*[a-z].*/.test(str)) {
    return ({ password: { missing: 'one lowercase' } });
  }

  if (str && !/.*[A-Z].*/.test(str)) {
    return ({ password: { missing: 'one uppercase' } });
  }

  if (str && /^(.{0,5}|[a-zA-Z0-9]*)$/i.test(str)) {
    return ({ password: { missing: 'one special character' } });
  }

  return null;
}

function noSpaceValidator(control: AbstractControl): ValidationErrors | null {
  const str: string = control.value;
  if (str && str.indexOf(' ') !== -1) {
    return ({ noSpace: true });
  }

  return null;
}

function lettersOnlyValidator(control: AbstractControl): ValidationErrors | null {
  const str: string = control.value;
  if (str && !/^[a-z]+$/i.test(str)) {
    return ({ lettersOnly: true });
  }

  return null;
}

function startsWithALetterValidator(control: AbstractControl): ValidationErrors | null {
  const str: string = control.value;
  if (str && !/^[a-z].*$/i.test(str)) {
    return ({ startsWithALetter: true });
  }

  return null;
}

function safeWordValidator(control: AbstractControl): ValidationErrors | null {
  const str: string = control.value;
  if (str && !/^[a-z0-9_]+$/i.test(str)) {
    return ({ safeWord: true });
  }

  return null;
}

function uppercaseOnlyValidator(control: AbstractControl): ValidationErrors | null {
  const str: string = control.value;
  if (str && !/^[A-Z]$/.test(str)) {
    return ({ uppercaseOnly: true });
  }

  return null;
}

@Component({
  selector: 'create-edit-user',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class UserFormComponent extends ErrorMessageProvider implements OnInit {

  @Input()
  mode: 'create' | 'edit';

  // Only set for edition
  @Input()
  user: ApiUserObject;

  @Input()
  cancellable = false;

  @Output()
  submitSucceed = new EventEmitter<ApiUserObject>();

  @Output()
  cancel = new EventEmitter<void>();

  // @Output()
  // submitFailed: () => any;

  helper;

  form;

  countryCodes: Array<{ name: string, code: string }> = cc;

  constructor(private service: UserService, private router: Router) {
    super();
  }

  private setFormControl(user) {
    return {
      username: new FormControl(user.username, [
        startsWithALetterValidator,
        safeWordValidator,
        Validators.minLength(1),
        Validators.maxLength(30)
      ]),
      email: new FormControl(user.email, [Validators.email]),
      password: new FormControl(undefined, [
        Validators.minLength(6),
        Validators.maxLength(64),
        passwordValidator,
        asciiValidator
      ]),
      role: user.role,
      identity: {
        commonName: new FormControl(user.identity.commonName, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30)
        ]),
        organization: new FormControl(user.identity.organization, [Validators.maxLength(64)]),
        organizationalUnit: new FormControl(user.identity.organizationalUnit, [Validators.maxLength(64)]),
        locality: new FormControl(user.identity.locality, [Validators.maxLength(64)]),
        country: user.identity.country || null,
        userId: new FormControl(user.identity.userId, [
          noSpaceValidator,
          Validators.maxLength(64)
        ])
      }
    };
  }

  private getFormObject() {
    // get "value" attribute of each form control attibutes recursively
    // deleting falsy ones
    const user = traverse(this.form).map(function (e) {
      if (e instanceof FormControl) {
        return e.value === null ? this.delete(false) : e.value;
      }
    });

    return user;
  }

  ngOnInit() {
    console.log('init', this.user);
    if (this.mode === 'edit') {
      this.form = this.setFormControl(copy<ApiUserObject>(this.user));
    } else {
      this.form = this.setFormControl({ role: 'user', identity: {} });
    }
  }

  async submit() {

    const user = this.getFormObject();

    this.helper = null;

    const cleaned = replaceInObject(user, '', null);
    console.log(cleaned, user);

    let promise;
    if (this.mode === 'edit') {
      promise = this.service.update(this.user.id, cleaned)
        .then((up) => this.submitSucceed.emit(up));
    } else {
      promise = this.service.create(cleaned)
        .then((up) => this.submitSucceed.emit(up))
        .then(() => this.router.navigate(['/users']));
    }

    promise
      .catch((err: HttpErrorResponse) => {
        console.error('Caught', err);
        this.helper = err.error.message;
      });

  }

  triggerCancel() {
    this.cancel.emit();
  }

  isValid() {
    return traverse(this.form).reduce((acc: boolean, e) => acc && ((e instanceof FormControl) ? e.valid : true));
  }

}
