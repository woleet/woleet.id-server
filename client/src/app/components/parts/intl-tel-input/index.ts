import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import { ErrorMessageProvider } from '@components/util';

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
  styleUrls: ['./style.scss']
})
export class IntlTelInputComponent extends ErrorMessageProvider implements OnInit {

  @Input()
  maxLength;

  @Input()
  onlyNumbers;

  @Input() user: ApiUserObject;

  @Output()
  inputUnfocus = new EventEmitter<any>();

  AYTPhone: any;

  form;

  ngOnInit() {
    this.form = new FormControl('', [phoneNumberValidator]);

    if (this.user) {
      if (this.user.phone) {
        this.form.setValue(new AsYouType().input('+' + this.user.countryCallingCode + this.user.phone));
      }
    }
  }

  onInputChange(phoneInput: string) {
    this.AYTPhone = new AsYouType().input(phoneInput);
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
    this.form.setValue(this.AYTPhone);
  }
}
