/* User */

type ServerEventTypeEnum =
  'signature'
  | 'login'
  | 'key.create' | 'key.edit' | 'key.delete'
  | 'user.create' | 'user.edit' | 'user.delete'
  | 'token.create' | 'token.edit' | 'token.delete'
  ;

interface ServerEvent {
  type: ServerEventTypeEnum;
}

interface ApiServerEventObject extends ServerEvent {
  occurredAt: number;
  authorizedUserId?: string;
  authorizedTokenId?: string;
  associatedTokenId?: string;
  associatedUserId?: string;
  associatedKeyId?: string;
  data?: Object;
}
