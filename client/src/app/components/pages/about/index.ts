import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  templateUrl: './about.html'
})
export class AboutPageComponent {

  env = environment;

}
