import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import {
  MatToolbarModule, MatButtonModule, MatSidenavModule,
  MatIconModule, MatListModule, MatInputModule, MatCardModule,
  MatSelectModule,
  MatTooltipModule,
  MatRippleModule
} from '@angular/material';

import { LayoutModule } from '@angular/cdk/layout';

import { AppComponent } from '@parts/main';
import { NavBarComponent } from '@parts/nav-bar';
import { UserFormComponent } from '@parts/user.form';
import { ServerSettingsComponent } from '@parts/server.settings';
import { UserCardComponent } from '@parts/user.card';
import { KeyCardComponent } from '@parts/key.card';
import { APITokenCreateCardComponent } from '@parts/api-token.card.create';
import { APITokenCardComponent } from '@parts/api-token.card';
import { KeyCreateCardComponent } from '@parts/key.card.create';

import { LoginPageComponent } from '@pages/login';
import { SetupPageComponent } from '@pages/setup';
import { APITokensPageComponent } from '@pages/api-tokens';
import { UserPageComponent } from '@pages/user';
import { AboutPageComponent } from '@pages/about';
import { SettingsPageComponent } from '@pages/settings';
import { UserCreatePageComponent } from '@pages/user.create';
import { UserEditPageComponent } from '@pages/user.edit';
import { UserListPageComponent } from '@pages/user.list';
import { UserDetailPageComponent } from '@pages/user.detail';

// Services
import { AuthService } from '@services/auth';
import { AdminGuardService, UserGuardService, AnonymousGuardService } from '@guards/auth';

import { KeyService } from '@services/key';
import { UserService } from '@services/user';
import { InfoService } from '@services/info';
import { APITokenService } from '@services/api-token';
import { PageDataService } from '@services/page-data';

import { AllowCredentialsInterceptorService } from '@interceptors/allow-credentials';
import { UnauthorizedInterceptorService } from '@interceptors/unauthorized';
import { ForbiddenInterceptorService } from '@interceptors/forbidden';

import { NeedConfigGuardService } from '@services/guards/config';
import { ConfigService } from '@services/config';
import { StopPropagationDirective } from '@directives/stop-propagation';
import { StopRipplePropagationDirective } from '@directives/stop-ripple-propagation';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginPageComponent,
    SetupPageComponent,
    SettingsPageComponent,
    APITokensPageComponent,
    UserPageComponent,
    UserListPageComponent,
    UserFormComponent,
    UserCreatePageComponent,
    UserEditPageComponent,
    UserDetailPageComponent,
    AboutPageComponent,
    ServerSettingsComponent,
    UserCardComponent,
    KeyCardComponent,
    APITokenCardComponent,
    APITokenCreateCardComponent,
    KeyCreateCardComponent,
    StopPropagationDirective,
    StopRipplePropagationDirective
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
    MatRippleModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatTooltipModule,

    // app
    AppRoutingModule
  ],
  providers: [
    AdminGuardService, UserGuardService, AnonymousGuardService, NeedConfigGuardService,
    KeyService, UserService, InfoService, ConfigService, APITokenService, PageDataService,
    UnauthorizedInterceptorService, ForbiddenInterceptorService,
    AllowCredentialsInterceptorService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
