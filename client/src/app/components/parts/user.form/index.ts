import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '@services/user';
import { Router } from '@angular/router';
import copy from 'deep-copy';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { cleanupObject, ErrorMessageProvider, replaceInObject, passwordValidator, asciiValidator} from '@components/util';
import * as traverse from 'traverse';
import cc from '@components/cc';
import { addedDiff, updatedDiff } from 'deep-object-diff';
import * as log from 'loglevel';

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
  if (str && !/^[a-z0-9_\-]+$/i.test(str)) {
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

  formLocked = false;

  @Input()
  mode: 'create' | 'edit';

  // Only set for edition
  @Input()
  user: ApiUserObject;

  @Output()
  submitSucceed = new EventEmitter<ApiUserObject>();

  @Output()
  cancel = new EventEmitter<void>();

  helper;

  form;

  tmpPhone: string;
  tmpCountryCallingCode: string;
  phoneValid = true;

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
        Validators.maxLength(32)
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
          Validators.maxLength(64)
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
    log.debug('init', this.mode, this.user);
    if (this.mode === 'edit') {
      this.form = this.setFormControl(copy<ApiUserObject>(this.user));
    } else {
      this.form = this.setFormControl({ role: 'user', identity: {} });
    }
  }

  async submit() {

    this.formLocked = true;
    const user = this.getFormObject();
    user.phone = this.tmpPhone;
    user.countryCallingCode = this.tmpCountryCallingCode;

    this.helper = null;

    let promise;
    if (this.mode === 'edit') {
      const cleaned = updatedDiff(Object.assign({ password: undefined }, this.user), replaceInObject(user, '', null));
      log.debug(cleaned, user);

      promise = this.service.update(this.user.id, cleaned)
        .then((up) => this.submitSucceed.emit(up));
    } else {
      const cleaned: any = addedDiff({}, cleanupObject(user));
      log.debug(cleaned, user);

      promise = this.service.create(cleaned)
        .then((up) => this.submitSucceed.emit(up))
        .then(() => this.router.navigate(['/users']));
    }

    await promise
      .catch((err: HttpErrorResponse) => {
        this.helper = err.error.message;
      });

    this.formLocked = false;
  }

  triggerCancel() {
    this.cancel.emit();
  }

  isValid() {
    return traverse(this.form).reduce((acc: boolean, e) => acc && ((e instanceof FormControl) ? e.valid : true));
  }

  savePhone(phoneParsed: any) {
    if (phoneParsed == null) {
      this.tmpPhone = null;
      this.tmpCountryCallingCode = null;
      this.phoneValid = true;
    } else if (phoneParsed === 'Phone not valid') {
      this.phoneValid = false;
    } else {
      this.tmpPhone = phoneParsed.nationalNumber;
      this.tmpCountryCallingCode = phoneParsed.countryCallingCode;
      this.phoneValid = true;
    }
  }

}
