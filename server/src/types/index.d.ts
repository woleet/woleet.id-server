/* Server types */

import { Model } from 'sequelize';
import { SessionStore } from '../controllers/store.session';
import { AnySchema } from 'joi';
import * as Router from 'koa-router';

import '../../../types/api.api-token';
import '../../../types/api.server-config';
import '../../../types/api.user';
import '../../../types/api.key';
import '../../../types/api';
import '../../../types/api.enrollment';
import '../../../types/api.signed-identity';
import './oidc-provider';

interface Dictionary<T> {
  [Key: string]: T;
}

type DefineJoiModelAttributes<T> = {
  [P in keyof T]: AnySchema;
};

type UUID = string;

interface CommonInternalProperties {
  id: string;
  updatedAt: Date;
  createdAt: Date;
}

interface AppDefinition {
  name: string;
  port: number;
  router: Router;
}

interface SequelizeUserObject extends Model<InternalUserObject, ApiFullPostUserObject> {
}

/* User: server specific */
interface InternalUserObject extends UserObject, InternalIdentityObject, CommonInternalProperties {
  lastLogin: Date;

  role: UserRoleEnum;
  status: UserStatusEnum;
  mode: UserModeEnum;
  countryCallingCode: string;
  phone: string;
  email: string | null;
  /** Hexadecimal representation password hash */
  passwordHash: string;
  /** Hexadecimal representation password salt */
  passwordSalt: string;
  passwordItrs: number;

  tokenResetPassword: string | null;

  defaultKeyId: string;
}

interface InternalIdentityObject {
  x500CommonName: string;
  x500Organization: string;
  x500OrganizationalUnit: string;
  x500Locality: string;
  x500Country: string;
  x500UserId: string | null;
}

interface ApiFullPostUserObject extends UserObject, InternalIdentityObject {
  role?: UserRoleEnum;
  status?: UserStatusEnum;
  mode?: UserModeEnum;
  email?: string;
  countryCallingCode?: string;
  phone?: string;
  passwordHash?: string;
  passwordSalt?: string;
  passwordItrs?: number;
  tokenResetPassword?: string;
  defaultKeyId?: string;
}

interface SequelizeKeyObject extends Model<InternalKeyObject, ApiFullPostKeyObject> {
}

/* Key: server specific */
interface InternalKeyObject extends KeyObject, CommonInternalProperties {
  lastUsed: Date;

  name: string;
  type: KeyTypeEnum;
  status: KeyStatusEnum;
  expiration: number;
  revokedAt?: number;

  /** Hexadecimal representation of the mnemonic phrase */
  mnemonicEntropy?: string;
  /** Hexadecimal representation of the mnemonic's initialization vector */
  mnemonicEntropyIV?: string;
  /** Hexadecimal representation of the private key */
  privateKey?: string;
  /** Hexadecimal representation of the private key's initialization vector */
  privateKeyIV?: string;
  /** Boolean to indicate whether the private key is compressed or not */
  compressed?: boolean;
  /** Base 58 representation of the public key */
  publicKey: string;

  userId: string;
  user?: InternalUserObject;
  holder: KeyHolderEnum;
  device?: KeyDeviceEnum;
}

interface ApiFullPostKeyObject extends KeyObject {
  name: string;
  type?: KeyTypeEnum;
  status?: KeyStatusEnum;
  expiration?: number;
  holder: KeyHolderEnum;
  device?: KeyDeviceEnum;

  /** Hexadecimal representation of the mnemonic phrase */
  mnemonicEntropy?: string;
  /** Hexadecimal representation of the private key */
  privateKey?: string;
  /** Boolean to indicate whether the private key is compressed or not */
  compressed?: boolean;
  /** Base 58 representation of the public key */
  publicKey: string;
  /** Reference to the owner of the key */
  userId: string;
}

/* AbstractToken: server specific */
interface InternalTokenObject {
  id: string;
  scope: string[];
  type: 'api' | 'oauth';
  role: 'admin' | 'user';
  status: 'active' | 'blocked' | 'expired';
  exp: number;
  userId?: string;
}

/* OauthAccessToken: server specific */
interface InternalOauthTokenObject {
  iat: number;
  exp?: number;
  clientId?: string;
  gty: string;
  accountId: string;
  claims?: any;
  grantId: string;
  scope: string;
  kind: string;
  jti: string;
}

interface SequelizeAPITokenObject extends Model<InternalAPITokenObject, ApiFullPostAPITokenObject> {
}

/* APIToken: server specific */
interface InternalAPITokenObject extends APITokenObject, CommonInternalProperties {
  lastUsed: Date;

  name: string;
  status: APITokenStatusEnum;
  userId?: string;

  hash: string;
  value: string;

  /** Value initialization vector */
  valueIV: string;
}

interface ApiFullPostAPITokenObject extends APITokenObject {
  name: string;
  type?: KeyTypeEnum;
  status?: KeyStatusEnum;
  userId?: string;

  hash: string;
  value: string;

  /** Value initialization vector */
  valueIV: string;
}

/* Authorization */

interface Session {
  id: string;
  userId: string;
  userRole: UserRoleEnum;
  oauth?: Object;
}

/* Server config */
interface InternalServerConfigObject extends ServerConfig {
  version: number;
  identityURL: string;
  signatureURL: string;
  APIURL?: string;
  logoURL?: string;
  HTMLFrame?: string;
  defaultKeyId: string;
  defaultKey?: InternalKeyObject;
  fallbackOnDefaultKey: boolean;
  allowUserToSign: boolean;

  // OpenID Connect config
  enableOpenIDConnect: boolean;
  openIDConnectURL?: string;
  openIDConnectClientId?: string;
  openIDConnectClientSecret?: string;
  openIDConnectClientRedirectURL?: string;

  // OpenID Connect Provider config
  OIDCPProviderURL?: string;
  OIDCPClients?: ApiOIDCPClient[];
  enableOIDCP?: boolean;

  enrollmentExpirationOffset?: string;
  keyExpirationOffset?: string;

  // SMTP config
  enableSMTP?: boolean;
  SMTPConfig?: string;
  webClientURL?: string;

  // Mail template
  mailResetPasswordTemplate?: string;
  mailOnboardingTemplate?: string;
  mailKeyEnrollmentTemplate?: string;

  // Admin contact
  contact?: string;

  organizationName?: string;

  // ProofDesk config
  proofDeskAPIURL?: string;
  proofDeskAPIToken?: string;
  enableProofDesk?: boolean;

  // Block Password input for admin
  blockPasswordInput?: boolean;

  // Block password reset for user
  askForResetInput?: boolean;

  // Block identity endpoint without signed identity query
  preventIdentityExposure?: boolean;
}

interface ServerConfigUpdate extends ServerConfig {
  identityURL?: string;
  signatureURL?: string;
  APIURL?: string;
  logoURL?: string;
  HTMLFrame?: string;
  defaultKeyId?: string;
  fallbackOnDefaultKey?: boolean;
  allowUserToSign?: boolean;

  // OpenID Connect config
  enableOpenIDConnect?: boolean;
  openIDConnectURL?: string;
  openIDConnectClientId?: string;
  openIDConnectClientSecret?: string;
  openIDConnectClientRedirectURL?: string;

  // OpenID Connect Provider config
  OIDCPProviderURL?: string;
  OIDCPClients?: ApiOIDCPClient[];
  enableOIDCP?: boolean;

  enrollmentExpirationOffset?: string;
  keyExpirationOffset?: string;

  // SMTP config
  enableSMTP?: boolean;
  SMTPConfig?: string;
  webClientURL?: string;

  // Mail template
  mailResetPasswordTemplate?: string;
  mailOnboardingTemplate?: string;
  mailKeyEnrollmentTemplate?: string;

  // Admin contact
  contact?: string;

  organizationName?: string;

  // ProofDesk config
  proofDeskAPIURL?: string;
  proofDeskAPIToken?: string;
  enableProofDesk?: boolean;

  // Block Password input for admin
  blockPasswordInput?: boolean;

  // Block password reset for user
  askForResetInput?: boolean;

  // Block identity endpoint without signed identity query
  preventIdentityExposure?: boolean;
}

interface ServerConfigCreate extends ServerConfig {
  identityURL: string;
  signatureURL?: string;
  APIURL?: string;
  logoURL?: string;
  HTMLFrame?: string;
  defaultKeyId: string;
  fallbackOnDefaultKey?: boolean;
  allowUserToSign?: boolean;

  // OpenID Connect config
  enableOpenIDConnect?: boolean;
  openIDConnectURL?: string;
  openIDConnectClientId?: string;
  openIDConnectClientSecret?: string;
  openIDConnectClientRedirectURL?: string;

  // OpenID Connect Provider config
  OIDCPProviderURL?: string;
  OIDCPClients?: ApiOIDCPClient[];
  enableOIDCP?: boolean;

  enrollmentExpirationOffset?: string;
  keyExpirationOffset?: string;

  // SMTP config
  enableSMTP?: boolean;
  SMTPConfig?: string;
  webClientURL?: string;

  // Mail template
  mailResetPasswordTemplate?: string;
  mailOnboardingTemplate?: string;
  mailKeyEnrollmentTemplate?: string;

  // Admin contact
  contact?: string;

  organizationName?: string;

  // ProofDesk config
  proofDeskAPIURL?: string;
  proofDeskAPIToken?: string;
  enableProofDesk?: boolean;

  // Block Password input for admin
  blockPasswordInput?: boolean;

  // Block password reset for user
  askForResetInput?: boolean;

  // Block identity endpoint without signed identity query
  preventIdentityExposure?: boolean;
}

/* Enrollment */

interface InternalEnrollmentObject extends EnrollmentObject, CommonInternalProperties {
  userId: string;
  expiration: number;
  name: string;
  device?: KeyDeviceEnum;
  signatureRequestId?: string;
  keyExpiration?: number;
}

interface SequelizeEnrollmentObject extends Model<InternalEnrollmentObject, ApiPostEnrollmentObject> {
}

/* Signed identity */

interface InternalSignedIdentityObject extends SignedIdentityObject, CommonInternalProperties {
  signedIdentity: string;
  publicKey: string;
}

interface SequelizeSignedIdentityObject extends Model<InternalSignedIdentityObject, ApiPostSignedIdentityObject> {
}

/* OIDC Provider */

type OIDCTokenEnum =
  'Session'
  | 'AccessToken'
  | 'AuthorizationCode'
  | 'RefreshToken'
  | 'DeviceCode'
  | 'ClientCredentials'
  | 'Client'
  | 'InitialAccessToken'
  | 'RegistrationAccessToken'
  | 'Interaction'
  | 'Grant';

interface OIDCToken {
  id: string;
  grantId: UUID;
  userCode: UUID;
  data: Object;
  expiresAt: Date;
  consumedAt?: Date;
}

interface ServerConfigError {
  oidcError?: string;
  oidcpError?: string;
  smtpError?: string;
  proofDeskError?: string;
}

declare module 'koa' {
  interface Context {
    sessions: SessionStore;
    session: Session | null;
    oidc?: any;
    token?: InternalTokenObject;
  }
}
