import { NgModule } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import {
  MatToolbarModule, MatButtonModule, MatSidenavModule,
  MatIconModule, MatListModule, MatInputModule, MatCardModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';

import { LayoutModule } from '@angular/cdk/layout';

import { AppComponent } from '@parts/main';
import { NavBarComponent } from '@parts/nav-bar';
import { UserFormComponent } from '@parts/user.form';
import { UserSettingsComponent } from '@parts/user.settings';
import { ServerSettingsComponent } from '@parts/server.settings';
import { UserCardComponent } from '@parts/user.card';
import { KeyCardComponent } from '@parts/key.card';
import { APIKeyCreateCardComponent } from '@parts/api-key.card.create';
import { APIKeyCardComponent } from '@parts/api-key.card';
import { KeyCreateCardComponent } from '@parts/key.card.create';

import { LoginPageComponent } from '@pages/login';
import { SetupPageComponent } from '@pages/setup';
import { APIKeysPageComponent } from '@pages/api-keys';
import { UserPageComponent } from '@pages/user';
import { AboutPageComponent } from '@pages/about';
import { SettingsPageComponent } from '@pages/settings';
import { UserCreatePageComponent } from '@pages/user.create';
import { UserEditPageComponent } from '@pages/user.edit';
import { UsersPageComponent } from '@pages/users';
import { UserDetailPageComponent } from '@pages/user.detail';

// Services
import { AuthService } from '@services/auth';
import { AdminGuardService, UserGuardService, AnonymousGuardService } from '@guards/auth';

import { KeyService } from '@services/key';
import { UserService } from '@services/user';
import { InfoService } from '@services/info';
import { APIKeyService } from '@services/api-key';

import { AllowCredentialsInterceptorService } from '@interceptors/allow-credentials';
import { UnauthorizedInterceptorService } from '@interceptors/unauthorized';
import { ForbiddenInterceptorService } from '@interceptors/forbidden';
import { NeedConfigGuardService } from '@services/guards/config';
import { ConfigService } from '@services/config';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginPageComponent,
    SetupPageComponent,
    SettingsPageComponent,
    APIKeysPageComponent,
    UserPageComponent,
    UsersPageComponent,
    UserFormComponent,
    UserCreatePageComponent,
    UserEditPageComponent,
    UserDetailPageComponent,
    AboutPageComponent,
    UserSettingsComponent,
    ServerSettingsComponent,
    UserCardComponent,
    KeyCardComponent,
    APIKeyCardComponent,
    APIKeyCreateCardComponent,
    KeyCreateCardComponent
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
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatTooltipModule

    // app
    AppRoutingModule
  ],
  providers: [
    AuthService, AdminGuardService, UserGuardService, AnonymousGuardService, NeedConfigGuardService,
    KeyService, UserService, InfoService, ConfigService, APIKeyService,
    UnauthorizedInterceptorService, ForbiddenInterceptorService, AllowCredentialsInterceptorService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
