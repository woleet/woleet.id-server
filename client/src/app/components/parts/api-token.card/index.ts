import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APITokenService } from '@services/api-token';
import { FormControl, Validators } from '@angular/forms';
import { ErrorMessageProvider } from '@components/util';
import { confirm } from '../../util';
import { UserService } from '@services/user';
import { ServerConfigService as ConfigService } from '@services/server-config';

@Component({
  selector: 'api-token-card',
  templateUrl: './index.html'
})
export class APITokenCardComponent extends ErrorMessageProvider implements OnInit {

  editMode = false;

  apiTokenName: FormControl;

  user$: Promise<ApiUserObject>;

  signatureURL: string;

  constructor(private userService: UserService, private apiTokenService: APITokenService,
              private configService: ConfigService) {
    super();
  }

  @Input()
  apiToken: ApiAPITokenObject;

  @Output()
  delete = new EventEmitter<ApiAPITokenObject>();

  @Output()
  update = new EventEmitter<ApiAPITokenObject>();

  displayApiToken = false;

  ngOnInit() {
    if (this.apiToken.userId) {
      this.user$ = this.userService.getById(this.apiToken.userId);
    }

    this.configService.getConfig().subscribe(config => {
      this.signatureURL = config.signatureURL;
    });
  }

  setEditMode(active) {
    this.editMode = active;
    if (this.editMode) {
      this.apiTokenName = new FormControl(this.apiToken.name, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]);
    }
  }

  async editToken() {
    const name = this.apiTokenName.value;

    if (name !== this.apiToken.name) {
      const up = await this.apiTokenService.update(this.apiToken.id, { name });
      this.update.emit(up);
      this.apiToken = up;
    }

    this.setEditMode(false);
  }

  async deleteToken() {
    if (!confirm(`Delete token ${this.apiToken.name}?`)) {
      return;
    }
    const deleted = await this.apiTokenService.delete(this.apiToken.id);
    this.apiToken = deleted;
    this.delete.emit(deleted);
  }

  async blockToken() {
    if (!confirm(`Block token ${this.apiToken.name}?`)) {
      return;
    }
    const up = await this.apiTokenService.update(this.apiToken.id, { status: 'blocked' });
    this.apiToken = up;
    this.update.emit(up);
  }

  async unblockToken() {
    const up = await this.apiTokenService.update(this.apiToken.id, { status: 'active' });
    this.apiToken = up;
    this.update.emit(up);
  }

  reveal() {
    this.displayApiToken = true;
    setTimeout(() => this.displayApiToken = false, 5 * 1000);
  }

  getProofKeeperURL(apiToken: string) {
    return `proofkeeper://wids?token=${apiToken}&url=${this.signatureURL}`;
  }

  copyTextToClipboard(textToCopy: string) {
    const dummyInput = document.createElement('textarea');
    document.body.appendChild(dummyInput);
    dummyInput.value = textToCopy;
    dummyInput.select();
    document.execCommand('copy');
    document.body.removeChild(dummyInput);
  }
}
