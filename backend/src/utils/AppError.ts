import AppErrorCode from '../constants/appErrorCode';
import HttpStatusCode from '../constants/httpStatusCode';

class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
