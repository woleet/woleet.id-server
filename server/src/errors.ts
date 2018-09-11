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
  constructor(m = 'User not found') { super(m); }
  name = 'NotFoundUserError';
}

export class NotFoundAPITokenError extends NotFoundDBObjectError {
  constructor(m = 'API token not found') { super(m); }
  name = 'NotFoundAPITokenError';
}

export class NotFoundKeyError extends NotFoundDBObjectError {
  constructor(m = 'Key not found') { super(m); }
  name = 'NotFoundKeyError';
}

export abstract class ForeignKeyDBError extends DBError { }

export class InvalidUserTargetedKeyError extends ForeignKeyDBError { }

export class ProtectedUserError extends DBError { name = 'ProtectedUserError'; }

export abstract class BlockedResourceError extends Error { }

export class BlockedUserError extends BlockedResourceError {
  constructor(m = 'User is blocked') { super(m); }
  name = 'BlockedUserError';
}

export class BlockedKeyError extends BlockedResourceError {
  constructor(m = 'Key is blocked') { super(m); }
  name = 'BlockedKeyError';
}

export class BlockedAPITokenError extends BlockedResourceError {
  constructor(m = 'API token is blocked') { super(m); }
  name = 'BlockedAPITokenError';
}

export class NoDefaultKeyError extends BlockedResourceError {
  constructor(m = 'No default key is set') { super(m); }
  name = 'NoDefaultKeyError';
}
