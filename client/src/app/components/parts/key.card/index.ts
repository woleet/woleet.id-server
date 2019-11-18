import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Device, KeyService } from '@services/key';
import { FormControl, Validators } from '@angular/forms';
import { ErrorMessageProvider, nextYear } from '@components/util';
import { UserService } from '@services/user';
import { confirm } from '../../util';
import { MatDialog } from '@angular/material';
import { DialogKeyDeleteComponent } from '@parts/dialog-key-delete';
import * as log from 'loglevel';

@Component({
  selector: 'app-key-card',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class KeyCardComponent extends ErrorMessageProvider {

  editMode = false;
  formLocked = false;
  deviceSelected: KeyDeviceEnum | null;
  minDate = new Date(Date.now() + 1000 * 60 * 60 * 24);

  keyName: FormControl;
  setAsDefault = false;

  @Input()
  modes: ('block' | 'edit' | 'delete' | 'revoke')[] = [];

  @Input()
  userId: string;

  @Input()
  userMode: UserModeEnum;

  @Input()
  key: ApiKeyObject;

  @Input()
  default = false;

  @Output()
  delete = new EventEmitter<ApiKeyObject>();

  @Output()
  update = new EventEmitter<ApiKeyObject>();

  @Output()
  updateUser = new EventEmitter<ApiKeyObject>();

  startDate = nextYear();

  expiration = new FormControl({ value: '', disabled: true }, []);

  devices: Device[] = [
    { value: null, viewValue: 'Any' },
    { value: 'nano', viewValue: 'Ledger Nano S' },
    { value: 'mobile', viewValue: 'Mobile device' }
  ];

  constructor(private keyService: KeyService, private userService: UserService,
    private dialog: MatDialog) {
    super();
    this.setAsDefault = this.default;
  }

  setEditMode(active) {
    this.editMode = active;
    if (this.editMode) {
      this.keyName = new FormControl(this.key.name, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]);
      this.deviceSelected = this.key.device;
      this.setAsDefault = this.default;
      const exp = this.key.expiration;
      this.expiration.setValue(exp ? new Date(exp) : null);
    }
  }

  async deleteKey() {
    const dialogRef = this.userMode === 'esign' ?
      this.dialog.open(DialogKeyDeleteComponent, {
        data: { isUser: true, name: this.key.name },
        width: '450px'
      })
      : this.dialog.open(DialogKeyDeleteComponent, {
        data: { isUser: false, name: this.key.name },
        width: '450px'
      });

    dialogRef.afterClosed().subscribe(async confirmDelete => {
      if (confirmDelete) {
        this.formLocked = true;
        const del = await this.keyService.delete(this.key.id);
        this.formLocked = false;
        this.delete.emit(del);
      }
    });
  }

  async revokeKey() {
    if (!confirm(`Revoke key ${this.key.name}?\n`
      + 'Warning: revoking a key is irreversible. A revoked key will be permanently unusable.\n'
      + 'However, signatures made before the revocation date will still be linked to this identity.')) {
      return;
    }
    if (this.default) {
      await this.userService.update(this.userId, { defaultKeyId: null });
      this.updateUser.emit();
    }
    this.formLocked = true;
    this.key = await this.keyService.update(this.key.id, { status: 'revoked' });
    this.formLocked = false;
    this.update.emit();
  }

  async editKey() {
    this.formLocked = true;
    const name = this.keyName.value;
    const expiration = +this.expiration.value || null;
    const device = this.deviceSelected;
    if (name !== this.key.name || expiration !== this.key.expiration || device !== this.key.device) {
      this.key = await this.keyService.update(this.key.id, { name, expiration, device });
      this.update.emit();
    }

    if (this.default !== this.setAsDefault) {
      try {
        await this.userService.update(this.userId, { defaultKeyId: this.setAsDefault ? this.key.id : null });
      } catch (err) {
        log.error(err);
      }
      this.updateUser.emit();
    }

    this.formLocked = false;
    this.setEditMode(false);
  }

  async blockKey() {
    if (!confirm(`Block key ${this.key.name}?`)) {
      return;
    }
    this.formLocked = true;
    this.key = await this.keyService.update(this.key.id, { status: 'blocked' });
    this.formLocked = false;
    this.update.emit();
  }

  async unblockKey() {
    this.formLocked = true;
    this.key = await this.keyService.update(this.key.id, { status: 'active' });
    this.formLocked = false;
    this.update.emit();
  }
}
