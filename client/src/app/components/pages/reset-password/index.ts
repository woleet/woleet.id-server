import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as log from 'loglevel';
import { FormControl, Validators } from '@angular/forms';
import { ErrorMessageProvider, passwordValidator, asciiValidator } from '@components/util';
import { UserService } from '@services/user';
import { MatDialog } from '@angular/material';
import { DialogResetPasswordComponent } from '@parts/dialog-reset-password';
import { DialogMailResetComponent } from '@components/parts/dialog-mail-reset';

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

  form;

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
    this.form = {
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [
        passwordValidator,
        asciiValidator,
        Validators.minLength(6),
        Validators.maxLength(64),
      ]),
      passwordConfirm: new FormControl('', [])
    };
  }

  async resetPassword() {
    try {
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
      const success = await this.userService.validate(this.email, this.password, this.token);
      const dialogRef = this.dialog.open(DialogResetPasswordComponent, {
        width: '250px',
        data: {success: false}
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
