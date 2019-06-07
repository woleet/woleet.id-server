import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '@services/user';
import { ErrorMessageProvider, nextYear } from '@components/util';
import { Device } from '@services/key';

@Component({
  selector: 'key-card-create-enroll',
  templateUrl: './index.html'
})
export class KeyCreateCardEnrollComponent extends ErrorMessageProvider {

  formLocked = false;
  errorMsgs: any[];
  publicKeyFocused: Boolean;
  deviceSelected: KeyDeviceEnum | null;

  @Input()
  userId: string;

  @Output()
  reset = new EventEmitter;

  @Output()
  create = new EventEmitter<ApiEnrollmentObject>();

  enrollmentName = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]);

  startDate = nextYear();

  devices: Device[] = [
    {value: null , viewValue: 'Any'},
    {value: 'nano', viewValue: 'Ledger Nano S'},
    {value: 'mobile', viewValue: 'Woleet ID for mobile'}
  ];

  expiration = new FormControl('', []);

  setAsDefault = false;

  constructor(private userService: UserService) {
    super();
  }

  async createEnrollment() {
    this.formLocked = true;
    const name = this.enrollmentName.value;
    const device = this.deviceSelected;
    const expiration = +this.expiration.value || undefined;
    const enrollment: ApiPostEnrollmentObject = { name, expiration, device, userId: this.userId };
    let newEnrollment;

    try {
      newEnrollment = await this.userService.keyEnrollment(enrollment);
      this.formLocked = false;
      this.enrollmentName.reset();
      this.reset.emit();
      this.create.emit(newEnrollment);
    } catch (error) {
      this.formLocked = false;
      this.errorMsgs = error.error.message.errors;
    }
  }

  cancelEnrollment() {
    this.enrollmentName.reset();
    this.reset.emit();
  }
}
