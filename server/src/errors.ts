class DBError extends Error {
  original: Error;
  constructor(message, original: Error = null) {
    super(message);
    this.name = "WidError";
    this.original = original;
  }
}

export abstract class DuplicatedDBObjectError extends DBError { }

export class DuplicatedUserError extends DuplicatedDBObjectError {
  name = 'DuplicatedUserError'
}

export abstract class NotFoundDBObjectError extends DBError { }

export class NotFoundUserError extends NotFoundDBObjectError {
  constructor() { super('User not found') }
  name = 'NotFoundUserError'
}

export class NotFoundKeyError extends NotFoundDBObjectError {
  constructor() { super('User not found') }
  name = 'NotFoundUserError'
}

export abstract class ForeignKeyDBError extends DBError { }

export class InvalidUserTargetedKeyError extends ForeignKeyDBError { }

export class ProtectedUserError extends DBError { name = 'ProtectedUserError' }
