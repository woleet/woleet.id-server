import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NeedConfigGuardService as NeedConfig } from '@guards/config';
import { UserGuardService as IsUser } from '@guards/auth';
import { AdminGuardService as IsAdmin } from '@guards/auth';
import { AnonymousGuardService as IsAnonymous } from '@guards/auth';

import { LoginPageComponent } from '@pages/login';
import { SetupPageComponent } from '@pages/setup';
import { APIKeysPageComponent } from '@pages/api-keys';
import { UserPageComponent } from '@pages/user';
import { AboutPageComponent } from '@pages/about';
import { SettingsPageComponent } from '@pages/settings';
import { UserListPageComponent } from '@pages/user.list';
import { UserCreatePageComponent } from '@pages/user.create';
import { UserEditPageComponent } from '@pages/user.edit';
import { UserDetailPageComponent } from '@pages/user.detail';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent, canActivate: [IsAnonymous] },
  { path: 'setup', component: SetupPageComponent, canActivate: [NeedConfig] },
  { path: 'user', component: UserPageComponent, canActivate: [IsUser] },
  { path: 'user/create', component: UserCreatePageComponent, canActivate: [IsAdmin] },
  { path: 'user/:id', component: UserDetailPageComponent, canActivate: [IsAdmin] },
  { path: 'user/:id/edit', component: UserEditPageComponent, canActivate: [IsAdmin] },
  { path: 'users', component: UserListPageComponent, canActivate: [IsAdmin] },
  { path: 'settings', component: SettingsPageComponent, canActivate: [IsAdmin] },
  { path: 'api-keys', component: APIKeysPageComponent, canActivate: [IsAdmin] },
  { path: 'about', component: AboutPageComponent, canActivate: [IsUser] },
  {
    path: '**',
    redirectTo: 'user'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
