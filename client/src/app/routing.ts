import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SetupComponent, AboutComponent, UserComponent, SettingsComponent, CredentialsComponent} from "./components";

const routes: Routes = [
  {path: 'setup-page', component: SetupComponent},
  {path: 'user-page', component: UserComponent},
  {path: 'settings-page', component: SettingsComponent},
  {path: 'credentials-page', component: CredentialsComponent},
  {path: 'about-page', component: AboutComponent}
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
