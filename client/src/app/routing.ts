import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService as AuthGuard } from '@services/auth-guard';

const MAIN = '';

import { LoginPageComponent } from '@pages/login';
import { SetupPageComponent } from '@pages/setup';
import { CredentialsPageComponent } from '@pages/credentials';
import { UserPageComponent } from '@pages/user';
import { AboutPageComponent } from '@pages/about';
import { SettingsPageComponent } from '@pages/settings';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'setup-page', component: SetupPageComponent, canActivate: [AuthGuard] },
  { path: 'user-page', component: UserPageComponent, canActivate: [AuthGuard] },
  { path: 'settings-page', component: SettingsPageComponent, canActivate: [AuthGuard] },
  { path: 'credentials-page', component: CredentialsPageComponent, canActivate: [AuthGuard] },
  { path: 'about-page', component: AboutPageComponent },
  {
    path: '**',
    redirectTo: 'user-page'
  },
  // {
  //   path: MAIN,
  //   redirectTo: 'user-page',
  //   pathMatch: 'full'
  // }
  // {
  //   path: 'settings',
  //   // component: SettingsComponent,
  //   data: {
  //     title: 'Settings'
  //   }
  // },
  // {
  //   path: 'examples',
  //   loadChildren: 'app/examples/examples.module#ExamplesModule'
  // },
  // {
  //   path: '**',
  //   redirectTo: 'about'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
