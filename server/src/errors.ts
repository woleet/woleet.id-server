class WidError extends Error {
  original: Error;
  constructor(message, original: Error = null) {
    super(message);
    this.name = "WidError";
    this.original = original;
  }
}

export abstract class DuplicatedDBObjectError extends WidError { }
export abstract class NotFoundDBObjectError extends WidError { }

export class DuplicatedUserError extends DuplicatedDBObjectError { name = 'DuplicatedUserError' }

export class ProtectedUserError extends WidError { name = 'ProtectedUserError' }

export class NotFoundUserError extends NotFoundDBObjectError {
  constructor() { super('User not found') }
  name = 'NotFoundUserError'
}
