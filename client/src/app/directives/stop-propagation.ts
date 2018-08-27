import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[no-prop]'
})
export class StopPropagationDirective {
  @HostListener('click', ['$event'])
  public onClick(event: Event): void {
    event.stopPropagation();
  }
}
