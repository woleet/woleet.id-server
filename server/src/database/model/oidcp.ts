import { Model, STRING, UUID, UUIDV4, JSON, DATE, ModelCtor, BuildOptions } from 'sequelize';
import { sequelize } from '../sequelize';

export const grantable = new Set<OIDCTokenEnum>([
  'AccessToken',
  'AuthorizationCode',
  'RefreshToken',
  'DeviceCode',
]);

export const models = (<OIDCTokenEnum[]>[
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
  const model = sequelize.define(name, {
    id: { type: STRING, primaryKey: true },
    grantId: { type: UUID, defaultValue: UUIDV4 },
    userCode: { type: UUID, defaultValue: UUIDV4 },
    data: { type: JSON },
    expiresAt: { type: DATE },
    consumedAt: { type: DATE }
  });

  map.set(name, model);

  return map;
}, new Map<OIDCTokenEnum, ModelCtor<Model<OIDCToken, OIDCToken>>>());
