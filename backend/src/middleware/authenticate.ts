import { RequestHandler } from 'express';
import HttpStatusCode from '../constants/httpStatusCode';
import appAssert from '../utils/appAssert';
import { verifyToken } from '../utils/jwt';
import AppErrorCode from '../constants/appErrorCode';

const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    HttpStatusCode.UNAUTHORIZED,
    'Not authorized',
    AppErrorCode.InvalidAccessToken
  );

  const { payload, error } = verifyToken(accessToken || '');
  appAssert(
    payload,
    HttpStatusCode.UNAUTHORIZED,
    error === 'jwt_expired' ? 'Token expired' : 'Invalid token',
    AppErrorCode.InvalidAccessToken
  );

  req.userId = payload.userId;
  req.sessionId = payload.sessionId;
  next();
};

export default authenticate;
