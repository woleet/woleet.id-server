import { Model, STRING, UUID, UUIDV4, JSON, DATE, ModelCtor, BuildOptions } from 'sequelize';
import { sequelize } from '../sequelize';

export const grantable = new Set<OIDCTokenEnum>([
  'AccessToken',
  'AuthorizationCode',
  'RefreshToken',
  'DeviceCode',
]);

export const models: Map<OIDCTokenEnum, Model<OIDCToken, OIDCToken>> = (<OIDCTokenEnum[]>[
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
  const model: ModelCtor<Model<OIDCToken, OIDCToken>> = <OIDCModelStatic>sequelize.define(name, {
    id: { type: STRING, primaryKey: true },
    grantId: { type: UUID, defaultValue: UUIDV4 },
    userCode: { type: UUID, defaultValue: UUIDV4 },
    data: { type: JSON },
    expiresAt: { type: DATE },
    consumedAt: { type: DATE }
  });

  map.set(name, model.build());

  return map;
}, new Map<OIDCTokenEnum, Model<OIDCToken, OIDCToken>>());

class OIDCModel extends Model {
  id: string;
  grantId: string;
  userCode: string;
  data: object;
  expiresAt: Date;
  consumedAt: Date;
}

type OIDCModelStatic = typeof Model & (new (values?: object, options?: BuildOptions) => OIDCModel);
