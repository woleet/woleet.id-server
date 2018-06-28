import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService as AuthGuard } from '@guards/auth';

const MAIN = '';

import { LoginPageComponent } from '@pages/login';
import { SetupPageComponent } from '@pages/setup';
import { CredentialsPageComponent } from '@pages/credentials';
import { UserPageComponent } from '@pages/user';
import { AboutPageComponent } from '@pages/about';
import { SettingsPageComponent } from '@pages/settings';
import { UsersPageComponent } from '@pages/users';
import { UserCreatePageComponent } from '@pages/user.create';
import { UserEditPageComponent } from '@pages/user.edit';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'setup', component: SetupPageComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserPageComponent, canActivate: [AuthGuard] },
  { path: 'user/create', component: UserCreatePageComponent, canActivate: [AuthGuard] },
  { path: 'user/:id', component: UserEditPageComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersPageComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsPageComponent, canActivate: [AuthGuard] },
  { path: 'credentials', component: CredentialsPageComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutPageComponent, canActivate: [AuthGuard] },
  {
    path: '**',
    redirectTo: 'user'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
