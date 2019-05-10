import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfigService } from '@services/boot';
import { MatDialog } from '@angular/material';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ActivatedRoute } from '@angular/router';
import { OnboardingService } from '@services/onboarding';

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

  config: { publicInfo: object, TCU: object, contact: string };
  serverPublicInfo: ApiServerConfig['publicInfo'];

  constructor(private _formBuilder: FormBuilder, appConfigService: AppConfigService, public dialog: MatDialog,
    private route: ActivatedRoute, private onboardingService: OnboardingService) {
    this.config = appConfigService.getStartupConfig();
    this.serverPublicInfo = this.config.publicInfo || null;
    this.onboardingId = this.route.snapshot.params.id;
    this.user$ = this.onboardingService.getUserByOnboardingId(this.onboardingId);
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
    });
  }
}
