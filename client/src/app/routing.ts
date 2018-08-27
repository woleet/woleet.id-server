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
  { path: 'login', data: { title: 'login' }, component: LoginPageComponent, canActivate: [IsAnonymous] },
  { path: 'setup', data: { title: 'setup' }, component: SetupPageComponent, canActivate: [NeedConfig] },
  { path: 'user', data: { title: 'my profile' }, component: UserPageComponent, canActivate: [IsUser] },
  { path: 'user/create', data: { title: 'create an user' }, component: UserCreatePageComponent, canActivate: [IsAdmin] },
  { path: 'user/:id', data: { title: 'user keys' }, component: UserDetailPageComponent, canActivate: [IsAdmin] },
  { path: 'user/:id/edit', data: { title: 'edit user' }, component: UserEditPageComponent, canActivate: [IsAdmin] },
  { path: 'users', data: { title: 'user list' }, component: UserListPageComponent, canActivate: [IsAdmin] },
  { path: 'settings', data: { title: 'server settings' }, component: SettingsPageComponent, canActivate: [IsAdmin] },
  { path: 'api-keys', data: { title: 'api keys' }, component: APIKeysPageComponent, canActivate: [IsAdmin] },
  { path: 'about', data: { title: 'about' }, component: AboutPageComponent, canActivate: [IsUser] },
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
