
export class ServerError extends Error {
  public httpStatus: number;

  constructor(message, httpStatus) {
    super(message);
    this.name = this.constructor.name;
    this.httpStatus = httpStatus;
    Error.captureStackTrace(this, this.constructor);
  }
}
