import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { UserDocument } from '../models/user.model';
import { SessionDocument } from '../models/session.model';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../constants/env';
import { error } from 'console';

type AccessTokenPayload = {
  userId: UserDocument['_id'];
  sessionId: SessionDocument['_id'];
};

type RefreshTokenPayload = {
  sessionId: SessionDocument['_id'];
};

type SignOptionsWithSecret = SignOptions & {
  secret: string;
};

type SignTokenParams = {
  payload: AccessTokenPayload | RefreshTokenPayload;
  type: 'access' | 'refresh';
  options?: SignOptionsWithSecret;
};

const defaultSignOptions: SignOptions = {
  audience: ['user'],
};

const accessTokenSignOptions: SignOptionsWithSecret = {
  expiresIn: '15m',
  secret: JWT_SECRET,
};

const refreshTokenSignOptions: SignOptionsWithSecret = {
  expiresIn: '7d',
  secret: JWT_REFRESH_SECRET,
};

export const signToken = ({ payload, type, options }: SignTokenParams) => {
  const defaultOptions =
    type === 'access' ? accessTokenSignOptions : refreshTokenSignOptions;
  const { secret, ...signOptions } = options || defaultOptions;

  return jwt.sign(payload, secret, { ...defaultSignOptions, ...signOptions });
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  const { secret = JWT_SECRET, ...verifyOptions } = options ?? {};

  try {
    const payload = jwt.verify(token, secret, {
      ...defaultSignOptions,
      ...verifyOptions,
    }) as TPayload;

    return { payload };
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
};
