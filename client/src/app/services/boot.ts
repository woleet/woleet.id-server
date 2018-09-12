import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import * as log from 'loglevel';

const reboot: Subject<void> = new Subject();

@Injectable({ providedIn: 'root' })
export class BootService {

  constructor(private ngZone: NgZone) { }

  public static getBootControl() {
    return reboot.asObservable();
  }

  public restart() {
    this.ngZone.runOutsideAngular(() => {
      log.debug('Reboot app');
      reboot.next();
    });
  }

}
