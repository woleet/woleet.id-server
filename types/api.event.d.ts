/* User */

type ServerEventTypeEnum = 'signature';

interface ServerEvent {
  type: ServerEventTypeEnum;
}

interface ApiServerEventObject extends ServerEvent, ApiCommonProperties {
  occurredAt: number;
  authorizedUserId?: string;
  associatedTokenId?: string;
  associatedUserId?: string;
  associatedkeyId?: string;
  data?: Object;
}
