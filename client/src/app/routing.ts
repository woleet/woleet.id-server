import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserGuardService as IsUser } from '@guards/auth';
import { AdminGuardService as IsAdmin } from '@guards/auth';
import { AnonymousGuardService as IsAnonymous } from '@guards/auth';

import { LoginPageComponent } from '@pages/login';
import { SetupPageComponent } from '@pages/setup';
import { CredentialsPageComponent } from '@pages/credentials';
import { UserPageComponent } from '@pages/user';
import { AboutPageComponent } from '@pages/about';
import { SettingsPageComponent } from '@pages/settings';
import { UsersPageComponent } from '@pages/users';
import { UserCreatePageComponent } from '@pages/user.create';
import { UserEditPageComponent } from '@pages/user.edit';
import { UserDetailPageComponent } from '@pages/user.detail';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent, canActivate: [IsAnonymous] },
  { path: 'setup', component: SetupPageComponent, canActivate: [IsAdmin] },
  { path: 'user', component: UserPageComponent, canActivate: [IsUser] },
  { path: 'user/create', component: UserCreatePageComponent, canActivate: [IsAdmin] },
  { path: 'user/:id', component: UserDetailPageComponent, canActivate: [IsAdmin] },
  { path: 'user/:id/edit', component: UserEditPageComponent, canActivate: [IsAdmin] },
  { path: 'users', component: UsersPageComponent, canActivate: [IsAdmin] },
  { path: 'settings', component: SettingsPageComponent, canActivate: [IsAdmin] },
  { path: 'credentials', component: CredentialsPageComponent, canActivate: [IsAdmin] },
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
