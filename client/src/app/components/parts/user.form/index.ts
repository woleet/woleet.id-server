import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '@services/user';
import { ActivatedRoute, Router } from '@angular/router';
import { diff } from 'deep-object-diff';
import copy from 'deep-copy';
import { HttpErrorResponse } from '@angular/common/http';

function clearEmptyString(obj) {
  for (const v in obj) {
    if (obj[v] === '')
      obj[v] = null;
  }
}

@Component({
  selector: 'create-edit-user',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class UserFormComponent implements OnInit {

  @Input()
  mode: 'create' | 'edit';

  helper;

  user;
  originalUser;

  constructor(private service: UserService, private route: ActivatedRoute, private router: Router) { }

  async ngOnInit() {
    if (this.mode == 'edit') {
      this.originalUser = await this.service.getById(this.route.snapshot.params.id);
      this.user = copy<ApiUserObject>(this.originalUser);
    } else {
      const user: ApiPostUserObject = ({
        username: '',
        email: '',
        password: '',
        role: 'user',
        identity: {
          commonName: undefined,
          organization: undefined,
          organizationalUnit: undefined,
          locality: undefined,
          country: undefined,
          userId: undefined
        }
      });
      this.user = user;
    }
  }

  async submit(user) {
    console.log('Create', user);

    // Replacing empty strings by null
    clearEmptyString(user);
    clearEmptyString(user.identity);

    console.log('Create', user);

    this.helper = null;

    let u;
    if (this.mode == 'edit') {
      const _user: ApiUserObject = user;
      const _diff = diff(this.originalUser, _user);
      console.log('Diff', _diff, this.originalUser, _user);
      u = this.service.update(user.id, _diff);
    } else {
      const _user: ApiPostUserObject = user;
      u = this.service.create(_user);
    }

    u
      .then(() => this.router.navigate(['/users']))
      .catch((err: HttpErrorResponse) => {
        console.error('err', err);
        this.helper = err.error.message;
      })

  }

}
