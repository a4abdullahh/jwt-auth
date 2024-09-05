import HttpStatusCode from '../constants/httpStatusCode';
import asyncHandler from '../utils/asyncHandler';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { createAccount, loginUser } from '../services/auth.service';
import { clearAuthCookies, setAuthCookies } from '../utils/cookies';
import { verifyToken } from '../utils/jwt';
import SessionModel from '../models/session.model';

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
  const accessToken = req.cookies.accessToken;
  const { payload } = verifyToken(accessToken);

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  return clearAuthCookies(res).status(HttpStatusCode.OK).json({
    message: 'Logout successful',
  });
});
