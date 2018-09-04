import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NeedConfigGuardService as NeedConfig } from '@guards/config';
import { UserGuardService as IsUser } from '@guards/auth';
import { AdminGuardService as IsAdmin } from '@guards/auth';
import { AnonymousGuardService as IsAnonymous } from '@guards/auth';

import { LoginPageComponent } from '@pages/login';
import { SetupPageComponent } from '@pages/setup';
import { APITokensPageComponent } from '@pages/api-tokens';
import { UserPageComponent } from '@pages/user';
import { AboutPageComponent } from '@pages/about';
import { SettingsPageComponent } from '@pages/settings';
import { UserListPageComponent } from '@pages/user.list';
import { UserCreatePageComponent } from '@pages/user.create';
import { UserEditPageComponent } from '@pages/user.edit';
import { UserDetailPageComponent } from '@pages/user.detail';

const routes: Routes = [
  { path: 'login', data: { title: 'Login' }, component: LoginPageComponent, canActivate: [IsAnonymous] },
  { path: 'setup', data: { title: 'Setup' }, component: SetupPageComponent, canActivate: [NeedConfig] },
  { path: 'user', data: { title: 'My profile' }, component: UserPageComponent, canActivate: [IsUser] },
  { path: 'user/create', data: { title: 'Create a user' }, component: UserCreatePageComponent, canActivate: [IsAdmin] },
  { path: 'user/:id', data: { title: 'User keys' }, component: UserDetailPageComponent, canActivate: [IsAdmin] },
  { path: 'user/:id/edit', data: { title: 'Edit user' }, component: UserEditPageComponent, canActivate: [IsAdmin] },
  { path: 'users', data: { title: 'User list' }, component: UserListPageComponent, canActivate: [IsAdmin] },
  { path: 'settings', data: { title: 'Server settings' }, component: SettingsPageComponent, canActivate: [IsAdmin] },
  { path: 'api-tokens', data: { title: 'API tokens' }, component: APITokensPageComponent, canActivate: [IsAdmin] },
  { path: 'about', data: { title: 'About' }, component: AboutPageComponent, canActivate: [IsUser] },
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
