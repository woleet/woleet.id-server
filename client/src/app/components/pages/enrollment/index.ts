import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '@services/boot';
import { MatDialog, MatStepper } from '@angular/material';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ActivatedRoute } from '@angular/router';
import { EnrollmentService } from '@services/enrollment';
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
export class EnrollmentPageComponent implements OnInit {
  isConfirmed = false;
  enrollmentId: string;
  user: ApiUserObject;
  enrollmentRefusalEmailLink: string;
  TCUURL: SafeUrl;
  errorMessage = '';
  completed = false;
  isDownloaded = false;
  config: any;

  constructor(appConfigService: AppConfigService, public dialog: MatDialog,
    private route: ActivatedRoute, private enrollmentService: EnrollmentService,
    sanitization: DomSanitizer) {
    this.config = appConfigService.getConfig();
    this.enrollmentId = this.route.snapshot.params.id;
    this.enrollmentService.getUserByEnrollmentId(this.enrollmentId)
      .subscribe(
        (user) => {
          return this.user = user;
        },
        (error) => {
          switch (error.error.message) {
            case 'NotFoundEnrollmentError':
              this.errorMessage = 'This page doesn\'t refer to an enrollment in progress.';
              break;
            case 'EnrollmentExpiredError':
              this.errorMessage = 'This page refer to an enrollment that is expired.' +
                ' Please contact the admin to begin a new enrollment process';
              break;
            default:
              this.errorMessage = error.error.message;
          }
        });
    this.TCUURL = sanitization.bypassSecurityTrustUrl(this.config.TCU.data);
  }

  ngOnInit() {
    this.enrollmentRefusalEmailLink = 'mailto:' + this.config.contact + '?Subject=Enrollment Refusal&body=';
  }

  confirm(stepper: MatStepper) {
    const stepsArray = stepper.steps.toArray();
    const currentStep = stepsArray[stepper.selectedIndex];
    currentStep.completed = true;
    stepper.next();
  }

  async setConfirm(value: boolean) {
    this.isConfirmed = value;
  }

  signTCU(): void {
    this.enrollmentService.createTCUSignatureRequest(this.enrollmentId, this.user.email)
      .subscribe(() => {
        this.completed = true;
      }, (error) => {
        log.error(error);
      });
  }

  download() {
    this.isDownloaded = true;
  }
}
