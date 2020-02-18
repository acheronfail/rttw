export default class ServerError extends Error {
  // Error for no entry found
  static ENOENT = 1 << 0;

  public code: number;
  public date: Date;

  constructor(code: number, message: string) {
    super(message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServerError);
    }

    // Custom debugging information
    this.code = code;
    this.date = new Date();
  }
}

export const isServerError = (err: Error) => err instanceof ServerError;
