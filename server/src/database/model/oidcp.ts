import { DATE, JSON, Model, ModelCtor, STRING, UUID, UUIDV4 } from 'sequelize';
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
  'Grant',
  'Interaction',
  'InitialAccessToken',
  'RegistrationAccessToken',
]).reduce((map, name: OIDCTokenEnum) => {
  const model = sequelize.define(name, {
    id: { type: STRING, primaryKey: true },
    grantId: { type: STRING, defaultValue: STRING },
    userCode: { type: UUID, defaultValue: UUIDV4 },
    data: { type: JSON },
    expiresAt: { type: DATE },
    consumedAt: { type: DATE }
  });

  map.set(name, model);

  return map;
}, new Map<OIDCTokenEnum, ModelCtor<Model<OIDCToken, OIDCToken>>>());
