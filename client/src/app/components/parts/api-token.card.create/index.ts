import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, Validators, ValidationErrors } from '@angular/forms';
import { APITokenService } from '@services/api-token';
import { ErrorMessageProvider } from '@components/util';
import { AuthService } from '@services/auth';
import { UserService } from '@services/user';

@Component({
  selector: 'api-token-create-card',
  templateUrl: './index.html'
})
export class APITokenCreateCardComponent extends ErrorMessageProvider implements OnInit {

  @Output()
  reset = new EventEmitter;

  @Output()
  create = new EventEmitter<ApiAPITokenObject>();

  userList$: Promise<ApiUserObject[]>;

  apiTokenName = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]);
  apiTokenUserId = new FormControl('', []);
  formLocked = false;

  constructor(
    private authService: AuthService,
    private apiTokenService: APITokenService,
    private userService: UserService) { super(); }

  async ngOnInit() {
    if (!this.userList$) {
      this.userList$ = this.userService.getAll();
    }
  }

  async createAPIToken() {
    this.formLocked = true;

    this.apiTokenName.disable();

    const name = this.apiTokenName.value;
    const userId = this.apiTokenUserId.value;
    const newApiTokenObject: ApiPostAPITokenObject = { name };
    if (userId) {
      newApiTokenObject.userId = userId;
    }
    const newapiToken = await this.apiTokenService.create(newApiTokenObject);

    this.apiTokenName.enable();

    this.apiTokenName.reset();
    this.reset.emit();
    this.create.emit(newapiToken);

    this.formLocked = false;
  }

  cancelAPIToken() {
    this.apiTokenName.reset();
    this.reset.emit();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }
}
