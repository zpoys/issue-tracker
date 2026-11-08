import type { ErrorStatusCode } from "./http-response";

export class MainError extends Error {
  code: string;
  status: ErrorStatusCode;

  constructor(message: string, code: string, status: ErrorStatusCode) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export class CheckConstraintError extends MainError {
  constructor(message: string = "") {
    super(message, "ERR_CHECK_CONSTRAINT", 400);
  }
}

export class NotNullError extends MainError {
  constructor(message: string = "") {
    super(message, "ERR_NOT_NULL", 400);
  }
}

export class ValidationError extends MainError {
  constructor(message: string = "") {
    super(message, "ERR_VALIDATION", 400);
  }
}

export class ParseError extends MainError {
  constructor(message: string = "") {
    super(message, "ERR_PARSE", 400);
  }
}

export class BadRequestError extends MainError {
  constructor(message: string = "") {
    super(message, "ERR_BAD_REQUEST", 400);
  }
}

export class UnauthorizedError extends MainError {
  constructor(message: string = "") {
    super(message, "ERR_UNAUTHORIZED", 401);
  }
}

export class ForbiddenError extends MainError {
  constructor(message: string = "") {
    super(message, "ERR_FORBIDDEN", 403);
  }
}

export class NotFoundError extends MainError {
  constructor(message: string = "") {
    super(message, "ERR_NOT_FOUND", 404);
  }
}

export class ForeignKeyError extends MainError {
  constructor(message: string = "") {
    super(message, "ERR_FOREIGN_KEY", 404);
  }
}

export class ConflictError extends MainError {
  constructor(message: string = "") {
    super(message, "ERR_DUPLICATE", 409);
  }
}

export class DatabaseError extends MainError {
  constructor(message: string = "") {
    super(message, "ERR_DATABASE", 500);
  }
}

export class InternalServerError extends MainError {
  constructor(message: string = "") {
    super(message, "ERR_INTERNAL_SERVER", 500);
  }
}
