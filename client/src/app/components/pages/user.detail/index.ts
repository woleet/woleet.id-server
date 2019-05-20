import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeyService } from '@services/key';
import { TrackById } from '../../util';
import { UserService } from '@services/user';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { Subscription } from 'rxjs';
import { DialogEnrolMailComponent } from '@components/parts/dialog-enrol-mail';
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

  contactAvailable: boolean;
  useSMTP: boolean;
  ServerClientURL: string;
  email: string;
  errorMsg: string;
  isProofDeskAvailable = false;

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
      this.isProofDeskAvailable = (!!config.proofDeskAPIToken || !!config.proofDeskAPIURL);
      config.contact ? this.contactAvailable = true : this.contactAvailable = false;
      this.ServerClientURL = config.ServerClientURL;
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

  async sendEnrolmentMail() {
    try {
      await this.userService.keyEnrolment(this.email);
    } catch (err) {
      this.errorMsg = err.error.message;
    }
    this.dialog.open(DialogEnrolMailComponent, {
      width: '250px'
    });
  }

  canEnrol(): Boolean {
    return (this.useSMTP && this.ServerClientURL && this.contactAvailable && this.isProofDeskAvailable);
  }
}
