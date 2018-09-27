import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NeedConfigGuardService as NeedConfig } from '@guards/config';
import { UserGuardService as IsUser } from '@guards/auth';
import { AdminGuardService as IsAdmin } from '@guards/auth';
import { AnonymousGuardService as IsAnonymous } from '@guards/auth';
import { ErrorGuardService as HasError } from '@guards/auth';

import { LoginPageComponent } from '@pages/login';
import { SetupPageComponent } from '@pages/setup';
import { APITokensPageComponent } from '@pages/api-tokens';
import { UserPageComponent } from '@pages/user';
import { AboutPageComponent } from '@pages/about';
import { SettingsPageComponent } from '@pages/settings';
import { UserListPageComponent } from '@pages/user.list';
import { UserEditPageComponent } from '@pages/user.edit';
import { UserDetailPageComponent } from '@pages/user.detail';
import { ErrorPageComponent } from '@components/pages/error';

const routes: Routes = [
  { path: 'error', data: { title: 'Error', hideNav: true }, component: ErrorPageComponent, canActivate: [HasError] },
  { path: 'login', data: { title: 'Login', hideNav: true }, component: LoginPageComponent, canActivate: [IsAnonymous] },
  { path: 'setup', data: { title: 'Setup' }, component: SetupPageComponent, canActivate: [NeedConfig] },
  { path: 'user', data: { title: 'My profile' }, component: UserPageComponent, canActivate: [IsUser] },
  { path: 'user/:id', data: { title: 'User keys' }, component: UserDetailPageComponent, canActivate: [IsAdmin] },
  { path: 'user/:id/edit', data: { title: 'Edit user' }, component: UserEditPageComponent, canActivate: [IsAdmin] },
  { path: 'users', data: { title: 'Users' }, component: UserListPageComponent, canActivate: [IsAdmin] },
  { path: 'settings', data: { title: 'Settings' }, component: SettingsPageComponent, canActivate: [IsAdmin] },
  { path: 'api-tokens', data: { title: 'API tokens' }, component: APITokensPageComponent, canActivate: [IsAdmin] },
  { path: 'about', data: { title: 'About' }, component: AboutPageComponent, canActivate: [IsUser] },
  {
    path: '**',
    redirectTo: 'user',
    canActivate: [IsUser]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
