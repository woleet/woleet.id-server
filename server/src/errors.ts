class DBError extends Error {
  original: Error;
  constructor(message, original: Error = null) {
    super(message);
    this.name = 'WidError';
    this.original = original;
  }
}

export abstract class DuplicatedDBObjectError extends DBError { }

export class DuplicatedUserError extends DuplicatedDBObjectError {
  name = 'DuplicatedUserError';
}

export abstract class NotFoundDBObjectError extends DBError { }

export class NotFoundUserError extends NotFoundDBObjectError {
  constructor() { super('User not found'); }
  name = 'NotFoundUserError';
}

export class NotFoundAPITokenError extends NotFoundDBObjectError {
  constructor() { super('API token not found'); }
  name = 'NotFoundAPITokenError';
}

export class NotFoundKeyError extends NotFoundDBObjectError {
  constructor() { super('Key not found'); }
  name = 'NotFoundKeyError';
}

export abstract class ForeignKeyDBError extends DBError { }

export class InvalidUserTargetedKeyError extends ForeignKeyDBError { }

export class ProtectedUserError extends DBError { name = 'ProtectedUserError'; }

export abstract class BlockedResourceError extends Error { }

export class BlockedUserError extends BlockedResourceError {
  constructor() { super('User is blocked'); }
  name = 'BlockedUserError';
}

export class BlockedKeyError extends BlockedResourceError {
  constructor() { super('Key is blocked'); }
  name = 'BlockedKeyError';
}

export class BlockedAPITokenError extends BlockedResourceError {
  constructor() { super('API token is blocked'); }
  name = 'BlockedAPITokenError';
}
