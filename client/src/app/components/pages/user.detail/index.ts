import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeyService } from '@services/key';
import { TrackById } from '../../util';
import { UserService } from '@services/user';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';

@Component({
  templateUrl: './index.html'
})
export class UserDetailPageComponent extends TrackById implements OnInit {

  userId = null;

  keys$: Promise<ApiKeyObject[]>;

  user$: Promise<ApiUserObject>;

  formOpened = false;
  externalFormOpened = false;
  enrollFormOpened = false;

  useSMTP: boolean;
  contactAvailable: boolean;
  proofDeskAvailable: boolean;
  webClientURL: string;

  email: string;

  errorMsg: string;

  private onDestroy: EventEmitter<void>;

  constructor(private keyService: KeyService, private userService: UserService,
    private route: ActivatedRoute, private configService: ConfigService,
    public dialog: MatDialog) {
    super();
    this.userId = this.route.snapshot.params.id;
    this.user$ = this.userService.getById(this.userId);
    this.onDestroy = new EventEmitter();
  }

  ngOnInit() {
    this.refreshKeyList();
    this.registerSubscription(this.configService.getConfig().subscribe((config) => {
      if (!config) {
        return;
      }
      this.useSMTP = config.useSMTP;
      this.contactAvailable = !!config.contact;
      this.proofDeskAvailable = config.proofDeskAPIIsValid;
      this.webClientURL = config.webClientURL;
    }));
    this.user$.then((user) => {
      this.email = user.email;
    });
  }

  registerSubscription(sub: Subscription) {
    this.onDestroy.subscribe(() => sub.unsubscribe());
  }

  refreshKeyList() {
    this.keys$ = this.keyService.getByUser(this.userId);
    this.user$ = this.userService.getById(this.userId);
  }

  refreshUser() {
    this.user$ = this.userService.getById(this.userId);
  }

  canEnroll(): Boolean {
    return (this.useSMTP && this.webClientURL && this.contactAvailable && this.proofDeskAvailable);
  }
}
