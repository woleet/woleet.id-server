import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '@services/boot';
import { MatStepper } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ActivatedRoute } from '@angular/router';
import { EnrollmentService } from '@services/enrollment';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { first } from 'rxjs/operators';

/**
 * @title Stepper overview
 */
@Component({
  templateUrl: 'index.html',
  styleUrls: ['./style.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class EnrollmentPageComponent implements OnInit {
  enrollmentId: string;
  user: ApiUserObject;
  enrollmentRefusalEmailLink: string;
  errorMessage = '';
  completed = false;
  isDownloaded = false;
  isSendingSignatureRequest = false;
  config: any;

  constructor(appConfigService: AppConfigService, private route: ActivatedRoute,
    private enrollmentService: EnrollmentService, private configService: ConfigService) {
    this.config = appConfigService.getConfig();
    this.enrollmentId = this.route.snapshot.params.id;
    this.enrollmentService.getUserByEnrollmentId(this.enrollmentId)
      .subscribe(
        (user) => {
          return this.user = user;
        },
        (error) => {
          switch (error.error.name) {
            case 'NotFoundEnrollmentError':
              this.errorMessage = 'This page doesn\'t refer to a signature key registration in progress';
              break;
            case 'EnrollmentExpiredError':
              this.errorMessage = 'This page refers to a signature key registration that is expired.' +
                ' Please contact the admin to begin a new signature key registration process.';
              break;
            default:
              this.errorMessage = error.error.message;
          }
        });
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

  signTCU(): void {
    this.isSendingSignatureRequest = true;
    this.enrollmentService.createTCUSignatureRequest(this.enrollmentId)
      .pipe(first())
      .subscribe(
        () => {
          this.isSendingSignatureRequest = false;
          this.completed = true;
        },
        (error) => {
          this.isSendingSignatureRequest = false;
          switch (error.error.name) {
            case 'NotFoundEnrollmentError':
              this.errorMessage = 'This page doesn\'t refer to a signature key registration in progress';
              break;
            case 'EnrollmentExpiredError':
              this.errorMessage = 'This page refers to a signature key registration that is expired.' +
                ' Please contact the admin to begin a new a signature key registration process.';
              break;
            case 'SignatureRequestCreationError':
              this.errorMessage = 'The signature request creation failed.' +
                ' Please contact the admin to begin a new a signature key registration process.';
              break;
            default:
              this.errorMessage = error.error.message;
          }
        });
  }

  download() {
    this.isDownloaded = true;
    this.configService.getTCU();
  }
}
