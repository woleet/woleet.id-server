import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfigService } from '@services/boot';
import { MatDialog } from '@angular/material';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { OnboardingService } from '@services/onboarding';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as log from 'loglevel';

/**
 * @title Stepper overview
 */
@Component({
  templateUrl: 'index.html',
  styleUrls: ['./style.scss'],
  providers: [{
    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class EnrolmentPageComponent implements OnInit {
  isConfirmed = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  onboardingId: string;
  user: ApiUserObject;
  emailstring: string;
  TCUURL: SafeUrl;
  errorMessage = '';
  completed = false;

  config: {
    publicInfo: {
      logoURL: string,
      HTMLFrame: string
    },
    TCU: {
      name: string,
      data: string
    },
    contact: string
  };
  serverPublicInfo: ApiServerConfig['publicInfo'];

  constructor(private _formBuilder: FormBuilder, appConfigService: AppConfigService, public dialog: MatDialog,
    private route: ActivatedRoute, private onboardingService: OnboardingService, sanitization: DomSanitizer,
    private router: Router) {
    this.config = appConfigService.getStartupConfig();
    this.serverPublicInfo = this.config.publicInfo || null;
    this.onboardingId = this.route.snapshot.params.id;
    this.onboardingService.getUserByOnboardingId(this.onboardingId)
      .subscribe(
        (user) => {
          return this.user = user;
        }
        , (error) => {
          switch (error.error.message) {
            case 'NotFoundOnboardingError':
              this.errorMessage = 'This page doesn\'t refer to an enrolment in progress.';
              break;
            case 'OnboardingExpiredError':
              this.errorMessage = 'This page refer to an enrolment that is expired.' +
                ' Please contact the admin to begin a new enrolment process';
              break;
            default:
              this.errorMessage = error.error.message;
          }
        });
    this.TCUURL = sanitization.bypassSecurityTrustUrl(this.config.TCU.data);
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.emailstring = 'mailto:' + this.config.contact + '?Subject=Enrolment Refusal&body=';
  }

  confirm() {
    this.isConfirmed = true;
  }

  signTCU(): void {
    this.onboardingService.createTCUSignatureRequest(this.onboardingId, this.user.email)
      .subscribe(() => {
        this.completed = true;
      }, (error) => {
        log.error(error);
      });
  }
}
