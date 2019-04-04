import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth';

@Component({
  templateUrl: './settings.html'
})
export class SettingsPageComponent implements OnInit {

  admin = false;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.admin = this.auth.isAdmin();
  }

}
