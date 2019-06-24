import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider } from '@components/util';
import { Observable } from 'rxjs';

@Component({
  selector: 'config-tcu',
  templateUrl: './index.html'
})
export class ConfigTCUComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

  formLocked$: Observable<boolean>;

  config$: Observable<ApiServerConfig>;

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

  async onSelectFile(event) {
    if (event.target.files && event.target.files.length > 0) {
      if (event.target.files[0].size < 4000000) {
        const file = <File>event.target.files[0];
        await console.log(file);
        this.configService.updateTCU(file);
      } else {
        this.errorMessage = 'This file is too large to be uploaded this way.';
      }
    }
  }

  selectFile(): void {
    this.fileInput.nativeElement.click();
  }

  reset(): void {
    this.configService.defaultTCU();
  }

  getTCU() {
    return this.configService.getTCU();
  }
}
