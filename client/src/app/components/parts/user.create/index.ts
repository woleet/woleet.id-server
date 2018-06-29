import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class UserCreateComponent {

  user: ApiPostUserObject;

  constructor(private service: UserService, private router: Router) {
    this.user = { firstName: '', lastName: '', username: '', email: '', password: '' };
  }

  async submit() {
    console.log('Create', this.user);
    const user = await this.service.create(this.user);
    console.log('Created', user);
    this.router.navigate(['/users']);
  }

}
