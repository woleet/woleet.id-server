/* Server types */

import { Instance } from 'sequelize';
import { SessionStore } from '../controllers/store.session';
import { AnySchema } from 'joi';
import * as Router from 'koa-router';

import '../../../types/api.api-token';
import '../../../types/api.server-config';
import '../../../types/api.server-event';
import '../../../types/api.user';
import '../../../types/api.key';
import '../../../types/api';
import '../../../types/api.enrollment';
import './oidc-provider';

declare global {

  interface Dictionary<T> {
    [Key: string]: T;
  }

  type DefineJoiModelAttributes<T> = {
    [P in keyof T]: AnySchema;
  };

  type uuid = string;

  interface CommonInternalProperties {
    /** UUID */
    id: string;
    updatedAt: Date;
    createdAt: Date;
    deletedAt: Date;
  }

  interface ListOptions {
    offset?: number;
    limit?: number;
    full?: boolean;
  }

  interface AppDefinition {
    name: string;
    port: number;
    router: Router;
  }

  /* User: server specific */

  interface SequelizeUserObject extends Instance<InternalUserObject> {
  }

  interface InternalUserObject extends UserObject, InternalIdentityObject, CommonInternalProperties {
    lastLogin: Date;

    role: UserRoleEnum;
    status: UserStatusEnum;
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
    email?: string;
    countryCallingCode?: string;
    phone?: string;
    passwordHash?: string;
    passwordSalt?: string;
    passwordItrs?: number;
    tokenResetPassword?: string;
    defaultKeyId?: string;
  }

  /* Key: server specific */

  interface SequelizeKeyObject extends Instance<InternalKeyObject> {
  }

  interface InternalKeyObject extends KeyObject, CommonInternalProperties {
    lastUsed: Date;

    name: string;
    type: KeyTypeEnum;
    status: KeyStatusEnum;
    expiration: number;

    /** Hexadecimal represention of the mnemonic phrase */
    mnemonicEntropy?: string;
    /** Hexadecimal represention of the mnemonic's initialization vector */
    mnemonicEntropyIV?: string;
    /** Hexadecimal represention of the private key */
    privateKey?: string;
    /** Hexadecimal represention of the private key's initialization vector */
    privateKeyIV?: string;
    /** Boolean to indicate weither the privatekey is compresssed or not */
    compressed?: boolean;
    /** Base 58 represention of the public key */
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

    /** Hexadecimal represention of the mnemonic phrase */
    mnemonicEntropy?: string;
    /** Hexadecimal represention of the private key */
    privateKey?: string;
    /** Boolean to indicate weither the privatekey is compresssed or not */
    compressed?: boolean;
    /** Base 58 represention of the public key */
    publicKey: string;
    /** Reference to the owner of the key */
    userId: string;
  }

  /* AbstractToken: server specific */
  interface InternalTokenObject {
    id: string,
    scope: string[],
    type: 'api' | 'oauth',
    role: 'admin' | 'user',
    status: 'active' | 'blocked' | 'expired',
    exp: number,
    userId?: string
  }

  /* OauthAccessToken: server specific */
  interface InternalOauthTokenObject {
    iat: number,
    iss: uri,
    exp: number,
    clientId: string,
    gty: string,
    accountId: string,
    claims: any,
    grantId: string,
    scope: string,
    kind: string,
    jti: string
  }

  /* APIToken: server specific */

  interface SequelizeAPITokenObject extends Instance<InternalAPITokenObject> {
  }

  interface InternalAPITokenObject extends APITokenObject, CommonInternalProperties {
    lastUsed: Date;

    name: string;
    status: APITokenStatusEnum;

    hash: string;
    value: string;

    /** Value initialization vector */
    valueIV: string;
  }

  interface ApiFullPostAPITokenObject extends APITokenObject {
    name: string;
    type?: KeyTypeEnum;
    status?: KeyStatusEnum;

    hash: string;
    value: string;

    /** Value initialization vector */
    valueIV: string;
  }

  /* Authorization */

  interface Session {
    id: string;
    exp: number;
    user: SequelizeUserObject;
    oauth?: Object;
  }

  /* Events */

  interface InternalServerEventObject extends ServerEvent, CommonInternalProperties {
    data: Object;
    occurredAt: Date;
    authorizedUserId: string;
    authorizedTokenId: string;
    associatedTokenId: string;
    associatedUserId: string;
    associatedKeyId: string;
    authorizedUser?: InternalUserObject;
    authorizedToken?: InternalUserObject;
    associatedToken?: InternalAPITokenObject;
    associatedUser?: InternalUserObject;
    associatedkey?: InternalKeyObject;
  }

  interface ServerEventCreate {
    data?: Object;
    type: ServerEventTypeEnum;
    authorizedUserId?: string;
    authorizedTokenId?: string;
    associatedTokenId?: string;
    associatedUserId?: string;
    associatedKeyId?: string;
    occurredAt?: Date;
  }

  /* Config */

  interface InternalServerConfigObject extends ServerConfig {
    version: number;
    identityURL: string;
    publicInfo?: {
      logoURL?: string;
      HTMLFrame?: string;
    }
    defaultKeyId: string;
    defaultKey?: InternalKeyObject;
    fallbackOnDefaultKey: boolean;
    allowUserToSign: boolean;
    // Open ID Connect config
    useOpenIDConnect: boolean;
    openIDConnectURL?: string;
    openIDConnectClientId?: string;
    openIDConnectClientSecret?: string;
    openIDConnectClientRedirectURL?: string;
    // Open ID Connect Provider config
    OIDCPInterfaceURL?: string;
    OIDCPProviderURL?: string;
    OIDCPIssuerURL?: string;
    OIDCPClients?: ApiOIDCPClient[];
    enableOIDCP?: boolean;

    enrollmentExpirationOffset?: string;
    keyExpirationOffset?: string;
    // SMTP config
    useSMTP?: boolean;
    SMTPConfig?: string;
    webClientURL?: string;
    // Mail template
    mailResetPasswordTemplate?: string;
    mailOnboardingTemplate?: string;
    mailKeyEnrollmentTemplate?: string;
    // TCU
    TCU?: {
      toDefault?: boolean;
      data?: string;
    }
    // Admin contact
    contact?: string;
    // ProofDesk config
    proofDeskAPIURL?: string;
    proofDeskAPIToken?: string;
    proofDeskAPIIsValid?: number;
  }

  interface ServerConfigUpdate extends ServerConfig {
    identityURL?: string;
    publicInfo?: {
      logoURL?: string;
      HTMLFrame?: string;
    }
    defaultKeyId?: string;
    fallbackOnDefaultKey?: boolean;
    allowUserToSign?: boolean;
    // Open ID Connect config
    useOpenIDConnect?: boolean;
    openIDConnectURL?: string;
    openIDConnectClientId?: string;
    openIDConnectClientSecret?: string;
    openIDConnectClientRedirectURL?: string;
    // Open ID Connect Provider config
    OIDCPInterfaceURL?: string;
    OIDCPProviderURL?: string;
    OIDCPIssuerURL?: string;
    OIDCPClients?: ApiOIDCPClient[];
    enableOIDCP?: boolean;

    enrollmentExpirationOffset?: string;
    keyExpirationOffset?: string;
    // SMTP config
    useSMTP?: boolean;
    SMTPConfig?: string;
    webClientURL?: string;
    // Mail template
    mailResetPasswordTemplate?: string;
    mailOnboardingTemplate?: string;
    mailKeyEnrollmentTemplate?: string;
    // TCU
    TCU?: {
      toDefault?: boolean;
      data?: string;
    }
    // Admin contact
    contact?: string;
    // ProofDesk config
    proofDeskAPIURL?: string;
    proofDeskAPIToken?: string;
    proofDeskAPIIsValid?: number;
  }

  interface ServerConfigCreate extends ServerConfig {
    identityURL: string;
    publicInfo?: {
      logoURL?: string;
      HTMLFrame?: string;
    }
    defaultKeyId: string;
    fallbackOnDefaultKey?: boolean;
    allowUserToSign?: boolean;
    // Open ID Connect config
    useOpenIDConnect?: boolean;
    openIDConnectURL?: string;
    openIDConnectClientId?: string;
    openIDConnectClientSecret?: string;
    openIDConnectClientRedirectURL?: string;
    // Open ID Connect Provider config
    OIDCPInterfaceURL?: string;
    OIDCPProviderURL?: string;
    OIDCPIssuerURL?: string;
    OIDCPClients?: ApiOIDCPClient[];
    enableOIDCP?: boolean;

    enrollmentExpirationOffset?: string;
    keyExpirationOffset?: string;
    // SMTP config
    useSMTP?: boolean;
    SMTPConfig?: string;
    webClientURL?: string;
    // Mail template
    mailResetPasswordTemplate?: string;
    mailOnboardingTemplate?: string;
    mailKeyEnrollmentTemplate?: string;
    // TCU
    TCU?: {
      toDefault?: boolean;
      data?: string;
    }
    // Admin contact
    contact?: string;
    // ProofDesk config
    proofDeskAPIURL?: string;
    proofDeskAPIToken?: string;
    proofDeskAPIIsValid?: number;
  }

  /* Enrollment */

  interface InternalEnrollmentObject extends EnrollmentObject {
    id: string;
    userId: string;
    expiration: number;
    name: string;
    device?: KeyDeviceEnum;
  }

  interface SequelizeEnrollmentObject extends Instance<InternalEnrollmentObject> {
  }

  interface ApiPostEnrollmentObject extends EnrollmentObject {
  }

  /* OIDC Provider */

  type OIDCTokenEnum = 'Session' | 'AccessToken' | 'AuthorizationCode' | 'RefreshToken'
    | 'DeviceCode' | 'ClientCredentials' | 'Client' | 'InitialAccessToken' | 'RegistrationAccessToken';

  interface OIDCToken {
    id: string;
    grantId: uuid;
    userCode: uuid;
    data: Object;
    expiresAt: Date;
    consumedAt: Date;
  }

  type OIDCGrantTypesEnum = 'refresh_token' | 'authorization_code';

  interface OIDCPClient {
    client_id: string,
    client_secret: string,
    grant_types: OIDCGrantTypesEnum[],
    redirect_uris: uri[],
  }
}

declare module 'koa' {
  interface Context {
    sessions: SessionStore;
    session: Session | null;
    oidc?: any;
    token?: InternalTokenObject;
  }
}
