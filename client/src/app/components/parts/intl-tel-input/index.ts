import { Component, Input, ContentChild, ViewChild, OnInit, Output, EventEmitter} from '@angular/core';
import { FormControl, ValidationErrors, AbstractControl} from '@angular/forms';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { ErrorMessageProvider } from '@components/util';
import * as log from 'loglevel';

function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
  if (control.value !== undefined && control.value !== '') {
    if (parsePhoneNumberFromString(control.value)) {
        if (parsePhoneNumberFromString(control.value).isValid()) {
          return null;
      }
    }
    return ({ 'phoneNumberValid': true });
  }
  return null;
}

@Component({
    selector: 'intl-tel-input',
    templateUrl: './index.html',
    styleUrls: ['./style.scss'],
  })
  export class IntlTelInputComponent extends ErrorMessageProvider implements OnInit {

    @Input() maxLength;

    @Input() onlyNumbers;

    @Input('user') user: ApiUserObject;

    @Output()
    inputUnfocus = new EventEmitter<any>();

    AYTPhone: any;
    phoneNumber: string;

    form = {phone: new FormControl('', [phoneNumberValidator])};

    ngOnInit() {
      if (this.user) {
        if (this.user.phone) {
          this.phoneNumber = new AsYouType().input('+' + this.user.countryCallingCode + this.user.phone);
        }
      }
    }

    onInputChange(phoneInput: string) {
      this.AYTPhone = new AsYouType().input(phoneInput);
      log.debug(this.AYTPhone);
      if (phoneInput) {
        if (parsePhoneNumberFromString(this.AYTPhone)) {
          if (parsePhoneNumberFromString(this.AYTPhone).isValid()) {
            this.inputUnfocus.emit(parsePhoneNumberFromString(this.AYTPhone));
          } else {
            this.inputUnfocus.emit('Phone not valid');
          }
        } else {
          this.inputUnfocus.emit('Phone not valid');
        }
      } else {
        this.inputUnfocus.emit(null);
      }
    }

    onFocusOut() {
      this.phoneNumber = this.AYTPhone;
    }
  }
