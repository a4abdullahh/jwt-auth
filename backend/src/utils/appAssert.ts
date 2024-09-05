import assert from 'node:assert';
import AppError from './AppError';
import HttpStatusCode from '../constants/httpStatusCode';
import AppErrorCode from '../constants/appErrorCode';

type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
  appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;
