import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class AboutPageComponent {

  env = environment

}
