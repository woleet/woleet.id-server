import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './routing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule} from '@angular/material';
import {LayoutModule} from '@angular/cdk/layout';

import {
  AppComponent,
  NavBarComponent,
  SettingsComponent,
  SetupComponent,
  CredentialsComponent,
  UserComponent,
  AboutComponent
} from './components';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    SettingsComponent,
    SetupComponent,
    CredentialsComponent,
    UserComponent,
    AboutComponent
  ],
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,

    // nav
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,

    // app
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
