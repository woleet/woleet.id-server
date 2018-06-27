import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { LoginPageComponent } from '@pages/login';
import { SetupPageComponent } from '@pages/setup';
import { CredentialsPageComponent } from '@pages/credentials';
import { UserPageComponent } from '@pages/user';
import { AboutPageComponent } from '@pages/about';
import { SettingsPageComponent } from '@pages/settings';

const routes: Routes = [
  {path: '', component: LoginPageComponent},
  {path: 'setup-page', component: SetupPageComponent},
  {path: 'user-page', component: UserPageComponent},
  {path: 'settings-page', component: SettingsPageComponent},
  {path: 'credentials-page', component: CredentialsPageComponent},
  {path: 'about-page', component: AboutPageComponent}
  // {
  //   path: '',
  //   redirectTo: 'about',
  //   pathMatch: 'full'
  // },
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
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})

export class AppRoutingModule { }
