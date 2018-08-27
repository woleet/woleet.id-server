import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[no-ripple-prop]'
})
export class StopRipplePropagationDirective {
  @HostListener('mousedown', ['$event'])
  public onMousedown(event: Event): void {
    event.stopImmediatePropagation();
  }
}
