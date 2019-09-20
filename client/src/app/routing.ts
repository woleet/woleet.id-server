import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NeedConfigGuardService as NeedConfig } from '@guards/config';
import {
  AdminGuardService as IsAdmin, AnonymousGuardService as IsAnonymous, ManagerGuardService as IsManager
  , ErrorGuardService as HasError, NoErrorGuardService as HasNoError, UserGuardService as IsUser
} from '@guards/auth';
import { LoginPageComponent } from '@pages/login';
import { SetupPageComponent } from '@pages/setup';
import { APITokensPageComponent } from '@pages/api-tokens';
import { UserPageComponent } from '@pages/user';
import { AboutPageComponent } from '@pages/about';
import { SettingsPageComponent } from '@pages/settings';
import { UserIdentityListPageComponent } from '@pages/user-identity.list';
import { SealIdentityListPageComponent } from '@pages/seal-identity.list';
import { UserDetailPageComponent } from '@pages/user.detail';
import { ErrorPageComponent } from '@components/pages/error';
import { OAuthRedirectComponent } from '@components/pages/oauth-redirect';
import { OIDCProviderInteractionComponent } from '@pages/oidcp-interaction';
import { ResetPasswordPageComponent } from '@pages/reset-password';
import { EnrollmentPageComponent } from '@pages/enrollment';

const routes: Routes = [
  {
    path: 'error',
    data: { title: 'Error', hideNav: true },
    component: ErrorPageComponent,
    canActivate: [HasError]
  },
  {
    path: 'login',
    data: { title: 'Login', hideNav: true },
    component: LoginPageComponent,
    canActivate: [HasNoError, IsAnonymous]
  },
  {
    path: 'reset-password',
    data: { title: 'ResetPassword', hideNav: true },
    component: ResetPasswordPageComponent
  },
  {
    path: 'enrollment/:id',
    data: { title: 'Enrollment', hideNav: true },
    component: EnrollmentPageComponent
  },
  {
    path: 'setup', data: { title: 'Setup' },
    component: SetupPageComponent,
    canActivate: [NeedConfig]
  },
  {
    path: 'user', data: { title: 'My profile' },
    component: UserPageComponent,
    canActivate: [IsUser]
  },
  {
    path: 'user/:id', data: { title: 'User keys' },
    component: UserDetailPageComponent,
    canActivate: [IsManager]
  },
  {
    path: 'oauth/callback',
    data: { title: 'Please wait...', hideNav: true },
    component: OAuthRedirectComponent,
    canActivate: [IsAnonymous]
  },
  {
    path: 'oidcp-interaction/:action/:grant',
    data: { title: 'OIDC Provider interaction', hideNav: true },
    component: OIDCProviderInteractionComponent,
    canActivate: [IsUser]
  },
  {
    path: 'users',
    data: { title: 'Users' },
    component: UserIdentityListPageComponent,
    canActivate: [IsManager]
  },
  {
    path: 'seals',
    data: { title: 'Seals' },
    component: SealIdentityListPageComponent,
    canActivate: [IsManager]
  },
  {
    path: 'settings', data: { title: 'Settings' },
    component: SettingsPageComponent,
    canActivate: [IsAdmin]
  },
  {
    path: 'api-tokens', data: { title: 'API tokens' },
    component: APITokensPageComponent,
    canActivate: [IsManager]
  },
  {
    path: 'about', data: { title: 'About' },
    component: AboutPageComponent,
    canActivate: [IsUser]
  },
  {
    path: '**',
    redirectTo: 'user',
    canActivate: [HasNoError, IsUser]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
