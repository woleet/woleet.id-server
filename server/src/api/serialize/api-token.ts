import { secureModule } from "../../config";

export async function serializeapiToken(token: InternalAPITokenObject): Promise<ApiAPITokenObject> {
  const dates = {
    createdAt: +token.createdAt || null,
    updatedAt: +token.updatedAt || null,
    deletedAt: +token.deletedAt || null,
    lastUsed: +token.lastUsed || null
  };

  const { id, name, status } = token;

  const value = (
    await secureModule.decrypt(
      Buffer.from(token.value, 'hex'),
      Buffer.from(token.valueIV, 'hex')
    )
  ).toString('base64');

  return Object.assign({ id, name, status, value }, dates);
}
