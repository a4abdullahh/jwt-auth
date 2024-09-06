import HttpStatusCode from '../constants/httpStatusCode';
import asyncHandler from '../utils/asyncHandler';
import {
  loginSchema,
  registerSchema,
  verificationCodeSchema,
} from '../schemas/auth.schema';
import {
  createAccount,
  loginUser,
  refreshAccessToken,
  verifyEmail,
} from '../services/auth.service';
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from '../utils/cookies';
import { verifyToken } from '../utils/jwt';
import SessionModel from '../models/session.model';
import appAssert from '../utils/appAssert';

export const registerHandler = asyncHandler(async (req, res) => {
  const body = registerSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent'] || 'unknown',
  });

  const { user, accessToken, refreshToken } = await createAccount(body);

  return setAuthCookies(res, accessToken, refreshToken)
    .status(HttpStatusCode.CREATED)
    .json(user);
});

export const loginHandler = asyncHandler(async (req, res) => {
  const body = loginSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent'] || 'unknown',
  });

  const { accessToken, refreshToken } = await loginUser(body);

  return setAuthCookies(res, accessToken, refreshToken)
    .status(HttpStatusCode.OK)
    .json({
      message: 'Login successful',
    });
});

export const logoutHandler = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  const { payload } = verifyToken(accessToken || '');

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  return clearAuthCookies(res).status(HttpStatusCode.OK).json({
    message: 'Logout successful',
  });
});

export const refreshHandler = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, HttpStatusCode.UNAUTHORIZED, 'Missing refresh token');

  const { accessToken, newRefreshToken } = await refreshAccessToken(
    refreshToken
  );

  if (newRefreshToken) {
    res.cookie('refreshToken', newRefreshToken, getRefreshTokenCookieOptions());
  }

  return res
    .status(HttpStatusCode.OK)
    .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
    .json({
      message: 'Access token refreshed',
    });
});

export const verifyEmailHandler = asyncHandler(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code);

  await verifyEmail(verificationCode);

  return res.status(HttpStatusCode.OK).json({
    message: 'Email verified',
  });
});
