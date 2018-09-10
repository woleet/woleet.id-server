export function serialiseServerEvent(evt: InternalServerEventObject): ApiServerEventObject {
  const dates = {
    createdAt: +evt.createdAt || null,
    updatedAt: +evt.updatedAt || null,
    occurredAt: +evt.occurredAt || null
  };

  const { id, type, data,
    authorizedUserId,
    authorizedTokenId,
    associatedTokenId,
    associatedUserId,
    associatedKeyId } = evt;

  return Object.assign({
    id, type, data,
    authorizedUserId,
    authorizedTokenId,
    associatedTokenId,
    associatedUserId,
    associatedKeyId
  }, dates);
}
