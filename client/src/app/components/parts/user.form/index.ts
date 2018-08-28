import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '@services/user';
import { ActivatedRoute, Router } from '@angular/router';
import { diff as diff } from 'deep-object-diff';
import copy from 'deep-copy';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ErrorMessageProvider, cleanupObject, replaceInObject } from '@components/util';
import * as traverse from 'traverse';

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

  helper;

  user;

  originalUser;

  constructor(private service: UserService, private route: ActivatedRoute, private router: Router) {
    super();
  }

  private setFormControl(user) {
    return {
      username: new FormControl(user.username, [lettersOnlyValidator, Validators.minLength(3), Validators.maxLength(30)]),
      email: new FormControl(user.email, [Validators.email]),
      password: new FormControl(undefined, [Validators.minLength(3), Validators.maxLength(250)]),
      role: user.role,
      identity: {
        commonName: new FormControl(user.identity.commonName, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
        organization: new FormControl(user.identity.organization, [Validators.minLength(3), Validators.maxLength(250)]),
        organizationalUnit: new FormControl(user.identity.organizationalUnit, [Validators.minLength(3), Validators.maxLength(250)]),
        locality: new FormControl(user.identity.locality, [Validators.minLength(3), Validators.maxLength(250)]),
        country: new FormControl(user.identity.country, [lettersOnlyValidator, Validators.minLength(2), Validators.maxLength(2)]),
        userId: new FormControl(user.identity.userId, [noSpaceValidator, Validators.minLength(3), Validators.maxLength(250)])
      }
    };
  }

  private getFormObject() {
    // get "value" attribute of each form control attibutes recursively
    // deleting falsy ones
    const user = traverse(this.user).map(function (e) {
      if (e instanceof FormControl) {
        return e.value === null ? this.delete(false) : e.value;
      }
    });

    return user;
  }

  async ngOnInit() {
    if (this.mode === 'edit') {
      this.originalUser = await this.service.getById(this.route.snapshot.params.id);
      this.user = this.setFormControl(copy<ApiUserObject>(this.originalUser));
    } else {
      this.user = this.setFormControl({ role: 'user', identity: {} });
    }
  }

  async submit() {

    const user = this.getFormObject();

    this.helper = null;

    const cleaned = replaceInObject(user, '', null);

    let promise;
    if (this.mode === 'edit') {
      promise = this.service.update(this.originalUser.id, cleaned);
    } else {
      promise = this.service.create(cleaned);
    }

    promise
      .then(() => this.router.navigate(['/users']))
      .catch((err: HttpErrorResponse) => {
        console.error('Caught', err);
        this.helper = err.error.message;
      });

  }

  isValid() {
    return traverse(this.user).reduce((acc: boolean, e) => acc && ((e instanceof FormControl) ? e.valid : true));
  }

}
