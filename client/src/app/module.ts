import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { LayoutModule } from '@angular/cdk/layout';
import { AppComponent } from '@parts/main';
import { NavBarComponent } from '@parts/nav-bar';
import { UserFormComponent } from '@parts/user.form';
import { UserCardComponent } from '@parts/user.card';
import { KeyCardComponent } from '@parts/key.card';
import { ConfigFallbackKeyComponent } from '@parts/config.fallback-key';
import { ConfigIdentityUrlComponent } from '@parts/config.identity-url';
import { ConfigSignatureUrlComponent } from '@parts/config.signature-url';
import { ConfigAPIUrlComponent } from '@parts/config.api-url';
import { ConfigWebClientUrlComponent } from '@parts/config.server-client-url';
import { APITokenCreateCardComponent } from '@parts/api-token.card.create';
import { APITokenCardComponent } from '@parts/api-token.card';
import { KeyCreateCardComponent } from '@parts/key.card.create';
import { KeyCreateCardExternComponent } from '@parts/key.card.create.extern';
import { KeyCreateCardEnrollComponent } from '@parts/key.card.create.enroll';
import { IntlTelInputComponent } from '@parts/intl-tel-input';
import { ConfigLogoUrlComponent } from '@parts/config.logo-url';
import { ConfigHTMLFrameUrlComponent } from '@parts/config.html-frame';
import { LogoComponent } from '@parts/logo';
import { HtmlFrameComponent, SafeHtmlPipe } from '@parts/html-frame';
import { ConfigContactComponent } from '@parts/config.contact';
import { ConfigOrganizationNameComponent } from '@parts/config.organization-name';
import { ConfigTCUComponent } from '@parts/config.tcu';
import { ConfigBlockPasswordInputComponent } from '@parts/config.block-password-input';
import { LoginPageComponent } from '@pages/login';
import { SetupPageComponent } from '@pages/setup';
import { APITokensPageComponent } from '@pages/api-tokens';
import { UserPageComponent } from '@pages/user';
import { AboutPageComponent } from '@pages/about';
import { ErrorPageComponent } from '@pages/error';
import { SettingsPageComponent } from '@pages/settings';
import { UserIdentityListPageComponent } from '@pages/user-identity.list';
import { SealIdentityListPageComponent } from '@pages/seal-identity.list';
import { UserKeyPageComponent } from '@pages/user.key';
import { UserDetailPageComponent } from '@pages/user.detail';
import { ResetPasswordPageComponent } from '@pages/reset-password';
import { EnrollmentPageComponent } from '@pages/enrollment';
import { DialogResetPasswordComponent } from '@parts/dialog-reset-password';
import { DialogMailResetComponent } from '@parts/dialog-mail-reset';
import { DialogAskResetComponent } from '@parts/dialog-ask-reset';
import { DialogIdentityDeleteComponent } from '@parts/dialog-identity-delete';
import { DialogKeyDeleteComponent } from '@parts/dialog-key-delete';
import {
  AdminGuardService, AnonymousGuardService, ErrorGuardService, ManagerGuardService, NoErrorGuardService,
  UserGuardService
} from '@guards/auth';
import { ExternalKeyService, KeyService } from '@services/key';
import { UserService } from '@services/user';
import { InfoService } from '@services/info';
import { APITokenService } from '@services/api-token';
import { PageDataService } from '@services/page-data';
import { ServerConfigService } from '@services/server-config';
import { EnrollmentService } from '@services/enrollment';
import { AllowCredentialsInterceptorService } from '@interceptors/allow-credentials';
import { NetworkErrorInterceptorService } from '@interceptors/network-error';
import { UnauthorizedInterceptorService } from '@interceptors/unauthorized';
import { ForbiddenInterceptorService } from '@interceptors/forbidden';
import { NeedConfigGuardService } from '@services/guards/config';
import { ConfigService } from '@services/config';
import { StopPropagationDirective } from '@directives/stop-propagation';
import { StopRipplePropagationDirective } from '@directives/stop-ripple-propagation';
import { AppConfigService } from '@services/boot';
import { ConfigOpenIDComponent } from '@components/parts/config.openid';
import { ConfigOIDCPComponent } from '@components/parts/config.oidcp';
import { ConfigOIDCPClientComponent } from '@components/parts/config.oidcp-client';
import { ConfigSMTPComponent } from '@components/parts/config.smtp';
import { ConfigMailTemplateComponent } from '@components/parts/config.mail';
import { ConfigProofDeskComponent } from '@components/parts/config.proofdesk';
import { ConfigAskResetPasswordInputComponent } from '@components/parts/config.ask-password-reset';
import { ConfigIdentityExposureComponent } from '@components/parts/config.identity-exposition';
import { LocalStorageService } from '@services/local-storage';
import { ConfigKeyExpirationComponent } from '@components/parts/config.key-expiration';
import { ConfigEnrollmentExpirationComponent } from '@parts/config.enrollment-expiration';
import { UserFilterPipe } from '@services/pipe/userFilter';

export function startupServiceFactory(appConfigService: AppConfigService): Function {
  return () => appConfigService.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginPageComponent,
    SetupPageComponent,
    SettingsPageComponent,
    APITokensPageComponent,
    UserPageComponent,
    UserIdentityListPageComponent,
    SealIdentityListPageComponent,
    UserFormComponent,
    UserKeyPageComponent,
    UserDetailPageComponent,
    AboutPageComponent,
    EnrollmentPageComponent,
    ConfigFallbackKeyComponent,
    ConfigIdentityUrlComponent,
    ConfigSignatureUrlComponent,
    ConfigAPIUrlComponent,
    ConfigWebClientUrlComponent,
    ConfigOpenIDComponent,
    ConfigOIDCPComponent,
    ConfigOIDCPClientComponent,
    ConfigKeyExpirationComponent,
    ConfigEnrollmentExpirationComponent,
    ConfigProofDeskComponent,
    UserCardComponent,
    KeyCardComponent,
    APITokenCardComponent,
    APITokenCreateCardComponent,
    KeyCreateCardComponent,
    KeyCreateCardExternComponent,
    KeyCreateCardEnrollComponent,
    StopPropagationDirective,
    StopRipplePropagationDirective,
    ErrorPageComponent,
    IntlTelInputComponent,
    ConfigLogoUrlComponent,
    ConfigHTMLFrameUrlComponent,
    ConfigMailTemplateComponent,
    ConfigAskResetPasswordInputComponent,
    LogoComponent,
    HtmlFrameComponent,
    SafeHtmlPipe,
    ResetPasswordPageComponent,
    ConfigSMTPComponent,
    ConfigContactComponent,
    ConfigOrganizationNameComponent,
    ConfigTCUComponent,
    ConfigBlockPasswordInputComponent,
    ConfigIdentityExposureComponent,
    DialogResetPasswordComponent,
    DialogMailResetComponent,
    DialogAskResetComponent,
    DialogIdentityDeleteComponent,
    DialogKeyDeleteComponent,
    UserFilterPipe
  ],
  entryComponents: [
    DialogResetPasswordComponent,
    DialogMailResetComponent,
    DialogAskResetComponent,
    DialogIdentityDeleteComponent,
    DialogKeyDeleteComponent
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
    MatTabsModule,
    MatRadioModule,

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
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,

    // app
    AppRoutingModule,

    // dialog
    MatDialogModule
  ],
  providers: [
    AppConfigService,
    {
      // Provider for APP_INITIALIZER
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [AppConfigService],
      multi: true
    },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    AdminGuardService, UserGuardService, AnonymousGuardService, ErrorGuardService, NoErrorGuardService, ManagerGuardService,
    NeedConfigGuardService, KeyService, ExternalKeyService, UserService, InfoService, ConfigService, APITokenService,
    PageDataService, ServerConfigService, EnrollmentService, UnauthorizedInterceptorService, ForbiddenInterceptorService,
    NetworkErrorInterceptorService, AllowCredentialsInterceptorService, LocalStorageService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
