import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatInputModule, MatCardModule
} from '@angular/material';

import { LayoutModule } from '@angular/cdk/layout';

import { AppComponent } from '@parts/main';
import { NavBarComponent } from '@parts/nav-bar';
import { UserCreateComponent } from '@parts/user.create';
import { UserSettingsComponent } from '@parts/user.settings';
import { ServerSettingsComponent } from '@parts/server.settings';

import { LoginPageComponent } from '@pages/login';
import { SetupPageComponent } from '@pages/setup';
import { CredentialsPageComponent } from '@pages/credentials';
import { UserPageComponent } from '@pages/user';
import { AboutPageComponent } from '@pages/about';
import { SettingsPageComponent } from '@pages/settings';
import { UserCreatePageComponent } from '@pages/user.create';
import { UserEditPageComponent } from '@pages/user.edit';
import { UsersPageComponent } from '@pages/users';

// Services
import { AuthService } from '@services/auth';
import { AuthGuardService } from '@guards/auth';

import { KeyService } from '@services/key';
import { UserService } from '@services/user';
import { InfoService } from '@services/info';
import { TokenInterceptorService } from '@services/interceptors/bearer';
import { UnauthorizedInterceptorService } from '@services/interceptors/unauthorized';
import { ForbiddenInterceptorService } from '@services/interceptors/forbidden';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginPageComponent,
    SetupPageComponent,
    SettingsPageComponent,
    CredentialsPageComponent,
    UserPageComponent,
    UsersPageComponent,
    UserCreateComponent,
    UserCreatePageComponent,
    UserEditPageComponent,
    AboutPageComponent,
    UserSettingsComponent,
    ServerSettingsComponent
  ],
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,

    // forms
    FormsModule,

    // material
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,

    // http
    HttpClientModule,

    // nav
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatCardModule,

    // app
    AppRoutingModule
  ],
  providers: [
    AuthService, AuthGuardService, KeyService, UserService, InfoService,
    TokenInterceptorService, UnauthorizedInterceptorService, ForbiddenInterceptorService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
