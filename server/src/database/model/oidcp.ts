import * as Sequelize from 'sequelize';
import { sequelize } from '../sequelize';

export const grantable = new Set<OIDCTokenEnum>([
  'AccessToken',
  'AuthorizationCode',
  'RefreshToken',
  'DeviceCode',
]);

export const models: Map<OIDCTokenEnum, Sequelize.Model<OIDCToken, OIDCToken>> = (<OIDCTokenEnum[]>[
  'Session',
  'AccessToken',
  'AuthorizationCode',
  'RefreshToken',
  'DeviceCode',
  'ClientCredentials',
  'Client',
  'InitialAccessToken',
  'RegistrationAccessToken',
]).reduce((map, name: OIDCTokenEnum) => {
  const model = sequelize.define<OIDCToken, OIDCToken>(name, {
    id: { type: Sequelize.STRING, primaryKey: true },
    grantId: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
    userCode: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
    data: { type: Sequelize.JSON },
    expiresAt: { type: Sequelize.DATE },
    consumedAt: { type: Sequelize.DATE },
  });

  map.set(name, model);

  return map;
}, new Map<OIDCTokenEnum, Sequelize.Model<OIDCToken, OIDCToken>>());
