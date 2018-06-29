import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-settings',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class ServerSettingsComponent {

  constructor(private router: Router) { }

  async submit() {
    this.router.navigate(['main']);
  }

}
