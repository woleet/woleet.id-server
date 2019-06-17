import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider } from '@components/util';
import { Observable } from 'rxjs';
import * as log from 'loglevel';

@Component({
  selector: 'config-tcu',
  templateUrl: './index.html'
})
export class ConfigTCUComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

  formLocked$: Observable<boolean>;

  config$: Observable<ApiServerConfig>;

  file: any;
  fileURL: any;
  fileInformation: string;
  errorMessage: string;
  organizationName: string;

  private onDestroy: EventEmitter<void>;

  @ViewChild('fileInput')
  fileInput: ElementRef;

  constructor(private configService: ConfigService) {
    super();
    this.onDestroy = new EventEmitter();
  }

  ngOnInit() {

    const config$ = this.config$ = this.configService.getConfig();

    this.formLocked$ = this.configService.isDoingSomething();

    const subscription = config$.subscribe((config) => {
      if (!config) {
        return;
      }
      this.organizationName = config.organizationName;
    });

    this.onDestroy.subscribe(() => subscription.unsubscribe());
  }

  ngOnDestroy() {
    this.onDestroy.emit();
  }

  async submit() {
    const TCU = {
      data: this.fileURL
    };
    log.debug('Set Terms and Conditions of Use to', TCU);
    this.configService.update({ TCU });
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files.length > 0) {
      if (event.target.files[0].size < 1000000) {
        this.file = event.target.files[0];
        const reader = new FileReader;
        reader.readAsDataURL(this.file);
        reader.onloadend = () => {
          this.fileURL = reader.result;
          this.submit();
        };
        this.fileInformation = null;
        this.errorMessage = null;
      } else {
        this.errorMessage = 'This file is too large to be uploaded this way.';
      }
    }
  }

  selectFile(): void {
    this.fileInput.nativeElement.click();
  }

  reset(): void {
    const TCU = {
      toDefault: true
    };
    log.debug('Set Terms and Conditions of Use to default');
    this.configService.update({ TCU });
  }

  getTCUURL() {
    return this.configService.getTCUURL();
  }
}
