import { Component } from '@angular/core';
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
export class ResetPasswordPageComponent extends ErrorMessageProvider {

    email: string;
    lock$: boolean;
    validationStep: boolean;
    password: string;
    passwordConfirm: string;
    redirect: string;
    userService: UserService;
    token: string;

    form = {email: new FormControl('', [Validators.email]),
            password: new FormControl('', [
                passwordValidator,
                asciiValidator,
                Validators.minLength(6),
                Validators.maxLength(64),
            ]),
            passwordConfirm: new FormControl('', [/*this.passwordConfirmValidator*/])};

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

    async resetPassword() {
        const success = this.userService.resetPassword(this.email);
    }

    async validate() {
        console.log(this.email);
        console.log(this.token);
        console.log(this.password);
        const success = this.userService.validate(this.email, this.password, this.token);
    }

    // passwordConfirmValidator(): ValidationErrors | null  {
    //     if (this.passwordConfirm !== this.password) {
    //         return ({ passwordConfirm: true });
    //     }
    //     return null;
    // }

}
