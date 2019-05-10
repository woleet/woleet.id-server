import { Component, EventEmitter, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider } from '@components/util';
import { Observable } from 'rxjs';
import * as log from 'loglevel';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'config-tcu',
  templateUrl: './index.html'
})
export class ConfigTCUComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

  editMode = false;

  formLocked$: Observable<boolean>;

  config$: Observable<ApiServerConfig>;

  form: FormControl;

  file: any;
  fileURL: any;
  fileInformation: string;

  private onDestroy: EventEmitter<void>;

  @ViewChild('fileInput')
  fileInput: ElementRef;

  constructor(private configService: ConfigService) {
    super();
    this.onDestroy = new EventEmitter();
  }

  ngOnInit() {
    this.form = new FormControl('', []);

    const config$ = this.config$ = this.configService.getConfig();

    this.formLocked$ = this.configService.isDoingSomething();

    const subscription = config$.subscribe((config) => {
      if (!config) {
        return;
      }

      this.editMode = false;
      this.form.setValue(config.TCU.name);
    });

    this.onDestroy.subscribe(() => log.debug('Unsuscribe', subscription.unsubscribe()));
  }

  ngOnDestroy() {
    this.onDestroy.emit();
  }

  async submit() {
    const TCU = {
      data: this.fileURL,
      name: this.file.name,
    };
    log.debug('Set Terms and Conditions of Use to', TCU);
    this.configService.update({ TCU });
  }

  cancelEdit() {
    this.editMode = false;
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.form.setValue(this.file.name);
      const reader = new FileReader;
      reader.readAsDataURL(this.file);
      reader.onloadend = () => {
        this.fileURL = reader.result;
      };
      this.fileInformation = null;
    }
  }

  selectFile(): void {
    this.fileInput.nativeElement.click();
  }

}
