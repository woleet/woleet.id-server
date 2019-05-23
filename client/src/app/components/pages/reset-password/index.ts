import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as log from 'loglevel';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { asciiValidator, ErrorMessageProvider, passwordValidator } from '@components/util';
import { UserService } from '@services/user';
import { MatDialog } from '@angular/material';
import { DialogResetPasswordComponent } from '@parts/dialog-reset-password';
import { DialogMailResetComponent } from '@parts/dialog-mail-reset';

export function confirmPasswordValidator(control: AbstractControl) {
  const str: string = control.value;

  if (!str) {
    return;
  }

  try {
    const password = control.parent.get('password').value;
    if (str !== password) {
      return ({ dont_match: true });
    }
  } catch (err) {
    return ({ dont_match: true });
  }

  return null;
}

@Component({
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class ResetPasswordPageComponent extends ErrorMessageProvider implements OnInit {

  email: string;
  lock$: boolean;
  validationStep: boolean;
  password: string;
  passwordConfirm: string;
  redirect: string;
  userService: UserService;
  token: string;
  errorMsg: string;
  emailInputFocused: boolean;

  formEmail: FormGroup;
  formValidate: FormGroup;
  passwordControl: FormControl;

  constructor(activatedRoute: ActivatedRoute, userConst: UserService, public dialog: MatDialog, private router: Router) {
    super();
    this.userService = userConst;
    activatedRoute.queryParams.subscribe(async (params) => {
      log.debug('Forwarded login parameters', params);
      if (params.token && params.email) {
        this.validationStep = true;
        this.email = params.email;
        this.token = params.token;
      } else {
        this.validationStep = false;
      }
    });
  }

  ngOnInit() {
    this.formEmail = new FormGroup({
      email: new FormControl('', [Validators.email])
    });
    this.formValidate = new FormGroup({
      password: new FormControl('', [
        passwordValidator,
        asciiValidator,
        Validators.minLength(6),
        Validators.maxLength(64)
      ]),
      passwordConfirm: new FormControl('', [
        Validators.required,
        confirmPasswordValidator
      ])
    });
  }

  async resetPassword() {
    try {
      this.email = this.formEmail.get('email').value;
      const success = await this.userService.resetPassword(this.email);
      const dialogRef = this.dialog.open(DialogMailResetComponent, {
        width: '250px'
      });
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['/login']);
      });
    } catch (err) {
      this.errorMsg = err.error.message;
    }
  }

  async validate() {
    try {
      this.password = this.formValidate.get('password').value;
      const success = await this.userService.validate(this.email, this.password, this.token);
      const dialogRef = this.dialog.open(DialogResetPasswordComponent, {
        width: '250px',
        data: { success: false }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['/login']);
      });
    } catch (err) {
      const dialogRef = this.dialog.open(DialogResetPasswordComponent, {
        width: '250px',
        data: false
      });

      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['/login']);
      });
    }
  }
}
