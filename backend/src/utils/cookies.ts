import { CookieOptions, Response } from 'express';
import { NODE_ENV } from '../constants/env';
import { addDays, addMinutes } from './date';

const REFRESH_PATH = '/auth/refresh';
const defaults: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: NODE_ENV === 'production',
};

const getAccessTokenCookieOptions = (): CookieOptions => {
  return {
    ...defaults,
    expires: addMinutes(15),
  };
};

const getRefreshTokenCookieOptions = (): CookieOptions => {
  return {
    ...defaults,
    expires: addDays(7),
    path: REFRESH_PATH,
  };
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) =>
  res
    .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
    .cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

export const clearAuthCookies = (res: Response) =>
  res.clearCookie('accessToken').cookie('refreshToken', {
    path: REFRESH_PATH,
  });
