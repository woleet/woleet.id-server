import { STRING, BOOLEAN, UUID, ARRAY, JSON } from 'sequelize';

import { AbstractInstanceAccess } from './abstract';
import { serverConfig } from '../../config';

const ServerConfigModel = {
  id: { type: STRING, defaultValue: serverConfig.CONFIG_ID, primaryKey: true },
  identityURL: { type: STRING, defaultValue: serverConfig.default.identityURL },
  fallbackOnDefaultKey: { type: BOOLEAN, defaultValue: serverConfig.default.fallbackOnDefaultKey },
  defaultKeyId: { type: UUID },
  useOpenIDConnect: { type: BOOLEAN, defaultValue: false },
  openIDConnectURL: { type: STRING },
  allowUserToSign: { type: BOOLEAN, defaultValue: false },
  openIDConnectClientId: { type: STRING },
  openIDConnectClientSecret: { type: STRING },
  openIDConnectClientRedirectURL: { type: STRING },
  enableOIDCP: { type: BOOLEAN, defaultValue: false },
  OIDCPInterfaceURL: { type: STRING },
  OIDCPIssuerURL: { type: STRING },
  OIDCPClients: { type: ARRAY(JSON) },
};

class ServerConfigAccess extends AbstractInstanceAccess<InternalServerConfigObject, ServerConfigCreate> {

  constructor() {
    super();
    this.define('ServerConfig', ServerConfigModel, { paranoid: false });
  }

  handleError(err: any) { }

}

export const ServerConfig = new ServerConfigAccess();
