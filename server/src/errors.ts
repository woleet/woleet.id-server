class WIDSError extends Error {

  original: Error; // the original error triggered

  constructor(message: string, error: Error = null) {
    super(message);
    this.original = error;
  }

  name = 'WIDSError';
}

export abstract class DuplicatedDBObjectError extends WIDSError {
}

export class DuplicatedUserError extends DuplicatedDBObjectError {
  name = 'DuplicatedUserError';
}

export abstract class NotFoundDBObjectError extends WIDSError {
}

export class NotFoundUserError extends NotFoundDBObjectError {
  constructor(m = 'User not found') {
    super(m);
  }

  name = 'NotFoundUserError';
}

export class NotFoundAPITokenError extends NotFoundDBObjectError {
  constructor(m = 'API token not found') {
    super(m);
  }

  name = 'NotFoundAPITokenError';
}

export class NotFoundKeyError extends NotFoundDBObjectError {
  constructor(m = 'Key not found') {
    super(m);
  }

  name = 'NotFoundKeyError';
}

export class NotFoundEnrollmentError extends NotFoundDBObjectError {
  constructor(m = 'Enrollment not found') {
    super(m);
  }

  name = 'NotFoundEnrollmentError';
}

export abstract class ForeignKeyDBError extends WIDSError {
}

export class InvalidForeignUserError extends ForeignKeyDBError {
  constructor(m = 'Invalid foreign user') {
    super(m);
  }

  name = 'InvalidForeignUserError';
}

export abstract class BlockedResourceError extends WIDSError {
}

export class BlockedUserError extends BlockedResourceError {
  constructor(m = 'User is blocked') {
    super(m);
  }

  name = 'BlockedUserError';
}

export class BlockedKeyError extends BlockedResourceError {
  constructor(m = 'Key is blocked') {
    super(m);
  }

  name = 'BlockedKeyError';
}

export class KeyNotHeldByServerError extends BlockedResourceError {
  constructor(m = 'The private key is not held by the server') {
    super(m);
  }

  name = 'KeyNotHeldByServerError';
}

export class ExpiredKeyError extends BlockedResourceError {
  constructor(m = 'Key expired') {
    super(m);
  }

  name = 'ExpiredKeyError';
}

export class RevokedKeyError extends BlockedResourceError {
  constructor(m = 'Key revoked') {
    super(m);
  }

  name = 'RevokedKeyError';
}

export class EnrollmentExpiredError extends BlockedResourceError {
  constructor(m = 'Enrollment expired') {
    super(m);
  }

  name = 'EnrollmentExpiredError';
}

export class NoDefaultKeyError extends WIDSError {
  constructor(m = 'No default key is set') {
    super(m);
  }

  name = 'NoDefaultKeyError';
}

export class KeyOwnerMismatchError extends WIDSError {
  constructor(m = 'Specified user does not match specified key') {
    super(m);
  }

  name = 'KeyOwnerMismatchError';
}

export class ServerNotReadyError extends WIDSError {
  constructor(m = 'Server not ready') {
    super(m);
  }

  name = 'ServerNotReadyError';
}

export class TokenResetPasswordInvalid extends WIDSError {
  constructor(m = 'Password reset token is invalid') {
    super(m);
  }

  name = 'TokenResetPasswordInvalid';
}
