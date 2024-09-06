import { CookieOptions, Response } from 'express';
import { NODE_ENV } from '../constants/env';
import { addDays, addMinutes } from './date';

export const REFRESH_PATH = '/auth/refresh';
const defaults: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: NODE_ENV === 'production',
};

export const getAccessTokenCookieOptions = (): CookieOptions => {
  return {
    ...defaults,
    expires: addMinutes(15),
  };
};

export const getRefreshTokenCookieOptions = (): CookieOptions => {
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
  res.clearCookie('accessToken').clearCookie('refreshToken', {
    path: REFRESH_PATH,
  });
