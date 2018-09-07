import * as Debug from 'debug';
const debug = Debug('id:serialize:event');

export function serialiseServerEvent(evt: InternalServerEventObject): ApiServerEventObject {
  const dates = {
    createdAt: +evt.createdAt || null,
    updatedAt: +evt.updatedAt || null,
    occurredAt: +evt.occurredAt || null
  };

  debug('Serialize', evt);

  const { id, type,
    authorizedUserId,
    associatedTokenId,
    associatedUserId,
    associatedkeyId } = evt;

  return Object.assign({
    id, type,
    authorizedUserId,
    associatedTokenId,
    associatedUserId,
    associatedkeyId
  }, dates);
}
