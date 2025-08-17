class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
module.exports = HttpError;