import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '@services/user';
import { ErrorMessageProvider, nextYear } from '@components/util';
import { Device } from '@services/key';
import { ServerConfigService } from '@services/server-config';
import * as timestring from 'timestring';
import * as log from 'loglevel';

@Component({
  selector: 'key-card-create-enroll',
  templateUrl: './index.html'
})
export class KeyCreateCardEnrollComponent extends ErrorMessageProvider {

  formLocked = false;
  errorMsgs: any[];
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
    { value: null, viewValue: 'Any' },
    { value: 'nano', viewValue: 'Ledger Nano S' },
    { value: 'mobile', viewValue: 'Mobile device' }
  ];

  expiration = new FormControl({ value: '', disabled: true }, []);
  keyExpiration = new FormControl({ value: '', disabled: true }, []);

  constructor(private userService: UserService, configService: ServerConfigService) {
    super();
    configService.getConfig().subscribe((config) => {
      if (!config) {
        return;
      }

      const now = +new Date;

      if (config.enrollmentExpirationOffset) {
        log.debug({ now, offset: config.enrollmentExpirationOffset });
        this.expiration.setValue(new Date(timestring(config.enrollmentExpirationOffset) * 1000 + now));
      }

      if (config.keyExpirationOffset) {
        this.keyExpiration.setValue(new Date(timestring(config.keyExpirationOffset) * 1000 + now));
      }
    });
  }

  async createEnrollment() {
    this.formLocked = true;
    const name = this.enrollmentName.value;
    const device = this.deviceSelected;
    const expiration = +this.expiration.value || undefined;
    const keyExpiration = +this.keyExpiration.value || undefined;
    const enrollment: ApiPostEnrollmentObject = { name, expiration, device, userId: this.userId, keyExpiration };
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
