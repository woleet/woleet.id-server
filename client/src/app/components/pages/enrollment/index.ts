import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfigService } from '@services/boot';
import { MatDialog } from '@angular/material';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ActivatedRoute, Router } from '@angular/router';
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
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  enrollmentId: string;
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
    private route: ActivatedRoute, private enrollmentService: EnrollmentService, sanitization: DomSanitizer,
    private router: Router) {
    this.config = appConfigService.getStartupConfig();
    this.serverPublicInfo = this.config.publicInfo || null;
    this.enrollmentId = this.route.snapshot.params.id;
    this.enrollmentService.getUserByEnrollmentId(this.enrollmentId)
      .subscribe(
        (user) => {
          return this.user = user;
        }
        , (error) => {
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
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.emailstring = 'mailto:' + this.config.contact + '?Subject=Enrollment Refusal&body=';
  }

  confirm() {
    this.isConfirmed = true;
  }

  signTCU(): void {
    this.enrollmentService.createTCUSignatureRequest(this.enrollmentId, this.user.email)
      .subscribe(() => {
        this.completed = true;
      }, (error) => {
        log.error(error);
      });
  }
}
