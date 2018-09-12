import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/module';
import { environment } from './environments/environment';
import { BootService } from '@services/boot';
import * as log from 'loglevel';

if (environment.production) {
  enableProdMode();
}

function init() {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => log.error(err));
}

init();

const boot = BootService.getBootControl().subscribe(() => init());
