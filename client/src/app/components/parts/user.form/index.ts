import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UserService } from '@services/user';
import { AuthService } from '@services/auth';
import { Router } from '@angular/router';
import copy from 'deep-copy';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {
  asciiValidator, cleanupObject, confirm, ErrorMessageProvider, passwordValidator, replaceInObject
} from '@components/util';
import cc from '@components/cc';
import { addedDiff, updatedDiff } from 'deep-object-diff';
import * as log from 'loglevel';
import { Subscription } from 'rxjs';
import { ServerConfigService as ConfigService } from '@services/server-config';

function noSpaceValidator(control: AbstractControl): ValidationErrors | null {
  const str: string = control.value;
  if (str && str.indexOf(' ') !== -1) {
    return ({ noSpace: true });
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

function passwordMandatoryValidatorOnEdit(sendPasswordEmail: boolean) {
  return function passwordMandatoryValidator(): ValidationErrors | null {
    if (!sendPasswordEmail) {
      return { passwordMandatoryValidator: true };
    }
    return null;
  };
}

@Component({
  selector: 'create-edit-user',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class UserFormComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

  formLocked = false;

  enableSMTP: boolean;
  blockPasswordInput: boolean;
  webClientURL: string;

  sendPasswordEmail = false;
  createDefaultKey = true;

  @Input()
  mode: 'create' | 'edit';

  // Only set for edition
  @Input()
  user: ApiUserObject;

  @Input()
  userMode: UserModeEnum;

  @Output()
  submitSucceed = new EventEmitter<ApiUserObject>();

  @Output()
  cancel = new EventEmitter<void>();

  helper;

  form: FormGroup;

  tmpPhone: string;
  tmpCountryCallingCode: string;
  phoneValid = true;
  errorMsg: string;

  usernameFocused = false;
  commonNameFocused = false;
  userIdFocused = false;

  countryCodes: Array<{ name: string, code: string }> = cc;

  private onDestroy: EventEmitter<void>;

  constructor(
    private service: UserService,
    private router: Router,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    super();
    this.onDestroy = new EventEmitter();
  }

  private setFormControl(user) {
    return new FormGroup({
      username: new FormControl(user.username, [
        safeWordValidator,
        Validators.minLength(2),
        Validators.maxLength(32)
      ]),
      email: new FormControl(user.email, [Validators.email]),
      password: new FormControl(undefined, [
        Validators.minLength(6),
        Validators.maxLength(64),
        passwordValidator,
        asciiValidator,
        passwordMandatoryValidatorOnEdit(!this.sendPasswordEmail)
      ]),
      role: new FormControl(user.role, []),
      identity: new FormGroup({
        commonName: new FormControl(user.identity.commonName, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(64)
        ]),
        organization: new FormControl(user.identity.organization, [Validators.maxLength(64)]),
        organizationalUnit: new FormControl(user.identity.organizationalUnit, [Validators.maxLength(64)]),
        locality: new FormControl(user.identity.locality, [Validators.maxLength(64)]),
        country: new FormControl(user.identity.country || null, []),
        userId: new FormControl(user.identity.userId, [
          noSpaceValidator,
          Validators.maxLength(64)
        ])
      })
    });
  }

  ngOnInit() {
    this.registerSubscription(this.configService.getConfig().subscribe((config) => {
      if (!config) {
        return;
      }
      this.enableSMTP = config.enableSMTP;
      this.webClientURL = config.webClientURL;
      this.blockPasswordInput = config.blockPasswordInput;
    }));
    if (this.mode === 'edit') {
      this.form = this.setFormControl(copy<ApiUserObject>(this.user));
      this.userMode = this.user.mode;
    } else {
      this.form = this.setFormControl({ role: 'user', identity: {} });
    }
  }

  registerSubscription(sub: Subscription) {
    this.onDestroy.subscribe(() => sub.unsubscribe());
  }

  ngOnDestroy() {
    this.onDestroy.emit();
  }

  async sendResetPasswordEmail(user: ApiUserObject) {
    try {
      await this.service.resetPassword(user.email);
    } catch (err) {
      this.errorMsg = err.error.message;
    }
  }

  async submit() {
    this.formLocked = true;
    const user = this.form.value;
    user.phone = this.tmpPhone;
    user.countryCallingCode = this.tmpCountryCallingCode;
    user.mode = this.userMode;

    this.helper = null;

    let promise;
    if (this.mode === 'edit') {
      const cleaned: ApiPutUserObject = updatedDiff(Object.assign({ password: undefined }, this.user), replaceInObject(user, '', null));
      const alreadyExist = cleaned.identity && (cleaned.identity.commonName || cleaned.identity.organization)
        ? await this.checkSealIdentity(user) : false;
      if (alreadyExist) {
        if (!confirm('This seal identity already exists.\n'
          + 'Do you still want to update it?')) {
          this.formLocked = false;
          return;
        }
      }

      promise = this.service.update(this.user.id, cleaned)
        .then((up) => this.submitSucceed.emit(up));
    } else {
      user.createDefaultKey = this.createDefaultKey;
      if (this.sendPasswordEmail) {
        user.password = null;
      }
      const cleaned: any = addedDiff({}, cleanupObject(user));
      const alreadyExist = await this.checkSealIdentity(user);
      if (alreadyExist) {
        if (!confirm('This seal identity already exists.\n'
          + 'Do you still want to create it?')) {
          this.formLocked = false;
          return;
        }
      }

      promise = this.service.create(cleaned)
        .then((up) => {
          if (this.sendPasswordEmail) {
            try {
              this.sendResetPasswordEmail(up);
            } catch (err) {
              log.debug(err);
            }
          }
          return this.submitSucceed.emit(up);
        });
    }
    await promise
      .catch((err: HttpErrorResponse) => {
        this.helper = err.error.message;
      });
    this.formLocked = false;
  }

  async checkSealIdentity(user: ApiUserObject) {
    let alreadyExist = false;
    if (user.mode === 'seal') {
      const query = { commonName: user.identity.commonName, organization: user.identity.organization, mode: 'seal' };
      alreadyExist = await this.service.getAll(query).then((users) => users.length > 0);
    }
    return alreadyExist;
  }

  triggerCancel() {
    this.cancel.emit();
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

  sendPasswordEmailCheck() {
    this.sendPasswordEmail = !this.sendPasswordEmail;
    this.sendPasswordEmail ? this.form.get('password').disable() : this.form.get('password').enable();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  canSendEmailToUser(): Boolean {
    return this.enableSMTP && this.webClientURL && this.form.get('email').valid && !!this.form.get('email').value;
  }
}
