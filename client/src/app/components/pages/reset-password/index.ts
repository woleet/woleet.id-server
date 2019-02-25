import { Component, OnInit } from '@angular/core';
import { mainRoute } from '@app/config';
import { Router, ActivatedRoute } from '@angular/router';

import * as log from 'loglevel';
import { ErrorService } from '@services/error';
import { FormControl, Validators, ValidationErrors } from '@angular/forms';
import { ErrorMessageProvider, passwordValidator, asciiValidator } from '@components/util';
import { UserService } from '@services/user';

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

    constructor(activatedRoute: ActivatedRoute, userConst: UserService) {
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
        this.form = {email: new FormControl('', [Validators.email]),
        password: new FormControl('', [
            passwordValidator,
            asciiValidator,
            Validators.minLength(6),
            Validators.maxLength(64),
        ]),
        passwordConfirm: new FormControl('', [/*this.passwordConfirmValidator*/])};
    }

    async resetPassword() {
      console.log('reset deb');
      try {
        const success = await this.userService.resetPassword(this.email);
      } catch (err) {
        this.errorMsg = err.error.message;
      }
    }

    async validate() {
      try {
        const success = await this.userService.validate(this.email, this.password, this.token);
      } catch (err) {
        this.errorMsg = err.error.message;
      }
    }

}
