class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    // 明確設定原型，確保正確的繼承
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
module.exports = HttpError;