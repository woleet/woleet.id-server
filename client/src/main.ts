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
    .then(() => (<any>window).appBootstrap && (<any>window).appBootstrap())
    .catch(err => log.error(err));
}

BootService.getBootControl().subscribe(() => init());

BootService.start();
