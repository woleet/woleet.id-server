export function serialiseServerEvent(evt: InternalServerEventObject): ApiServerEventObject {
  const dates = { occurredAt: +evt.occurredAt || null };

  const { type, data,
    authorizedUserId,
    authorizedTokenId,
    associatedTokenId,
    associatedUserId,
    associatedKeyId } = evt;

  return Object.assign({
    type: evt.type,
    data: evt.data || undefined,
    authorizedUserId: evt.authorizedUserId || undefined,
    authorizedTokenId: evt.authorizedTokenId || undefined,
    associatedTokenId: evt.associatedTokenId || undefined,
    associatedUserId: evt.associatedUserId || undefined,
    associatedKeyId: evt.associatedKeyId || undefined
  }, dates);
}