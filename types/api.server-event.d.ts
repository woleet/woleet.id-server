/* User */

type ServerEventTypeEnum =
  'signature'
  | 'config.edit'
  | 'login'
  | 'error'
  | 'key.create' | 'key.edit' | 'key.delete'
  | 'enrollment.create' | 'enrollment.create-signature-request'
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
