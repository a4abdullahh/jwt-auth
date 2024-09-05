import SessionModel from '../models/session.model';
import UserModel from '../models/user.model';
import VerificationCodeModel from '../models/verificationCode.model';
import VerificationCodeType from '../constants/verificationCodeType';
import appAssert from '../utils/appAssert';
import HttpStatusCode from '../constants/httpStatusCode';
import { addDays } from '../utils/date';
import { signToken } from '../utils/jwt';

export type AuthParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async ({
  email,
  password,
  userAgent,
}: AuthParams) => {
  const existingAccount = await UserModel.exists({ email });
  appAssert(!existingAccount, HttpStatusCode.CONFLICT, 'User already exists');

  const user = await UserModel.create({
    email,
    password,
  });

  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: addDays(365),
  });

  const session = await SessionModel.create({
    userId: user._id,
    userAgent,
  });

  const accessToken = signToken({
    payload: { userId: user._id, sessionId: session._id },
    type: 'access',
  });

  const refreshToken = signToken({
    payload: { sessionId: session._id },
    type: 'refresh',
  });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({ email, password, userAgent }: AuthParams) => {
  const user = await UserModel.findOne({ email });
  appAssert(user, HttpStatusCode.UNAUTHORIZED, 'Invalid email or password');

  const isValid = await user.comparePassword(password);
  appAssert(isValid, HttpStatusCode.UNAUTHORIZED, 'Invalid email or password');

  const session = await SessionModel.create({
    userId: user._id,
    userAgent,
  });

  const accessToken = signToken({
    payload: { userId: user._id, sessionId: session._id },
    type: 'access',
  });

  const refreshToken = signToken({
    payload: { sessionId: session._id },
    type: 'refresh',
  });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};
