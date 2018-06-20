class WidError extends Error {
  original: Error;
  constructor(message, original: Error) {
    super(message);
    this.name = "WidError";
    this.original = original;
  }
}

export class DuplicatedUserError extends WidError { name = 'DuplicatedUserError' }

export class ProtectedUserError extends WidError { name = 'ProtectedUserError' }
