import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfigService } from '@services/boot';
import { MatDialog } from '@angular/material';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ActivatedRoute } from '@angular/router';
import { OnboardingService } from '@services/onboarding';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  user$: Promise<ApiUserObject>;
  emailstring: string;
  TCUURL: SafeUrl;
  // defaultURL = 'https://doc.woleet.io/docs/terms-of-service';

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
    private route: ActivatedRoute, private onboardingService: OnboardingService, sanitization: DomSanitizer) {
    this.config = appConfigService.getStartupConfig();
    this.serverPublicInfo = this.config.publicInfo || null;
    this.onboardingId = this.route.snapshot.params.id;
    this.user$ = this.onboardingService.getUserByOnboardingId(this.onboardingId);
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

  signTCU() {
    this.user$.then((user) => {
      this.onboardingService.createTCUSignatureRequest(user.email);
    })
    .catch(err => {
      console.log(err);
    });
  }
}
