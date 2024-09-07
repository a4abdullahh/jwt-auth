import SessionModel from '../models/session.model';
import UserModel from '../models/user.model';
import VerificationCodeModel from '../models/verificationCode.model';
import VerificationCodeType from '../constants/verificationCodeType';
import appAssert from '../utils/appAssert';
import HttpStatusCode from '../constants/httpStatusCode';
import { addDays, subtractMinutes } from '../utils/date';
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from '../utils/jwt';
import mongoose from 'mongoose';
import { sendMail } from '../utils/sendMail';
import {
  getVerifyEmailTemplate,
  getPasswordResetEmailTemplate,
} from '../utils/emailTemplates';
import { APP_ORIGIN } from '../constants/env';
import { hashPassword } from '../utils/bcrypt';
import { userInfo } from 'os';

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

  const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;

  await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
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

export const refreshAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, HttpStatusCode.UNAUTHORIZED, 'Invalid refresh token');

  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    HttpStatusCode.UNAUTHORIZED,
    'Session expired'
  );

  const sessionNeedsRefresh =
    session.expiresAt.getTime() - now <= addDays(1).getTime();
  if (sessionNeedsRefresh) {
    session.expiresAt = addDays(7);
    await session.save();
  }

  const accessToken = signToken({
    payload: { userId: session.userId, sessionId: session._id },
    type: 'access',
  });

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({
        payload: { sessionId: session._id },
        type: 'refresh',
      })
    : undefined;

  return {
    accessToken,
    newRefreshToken,
  };
};

export const verifyEmail = async (code: mongoose.Types.ObjectId) => {
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });
  appAssert(
    validCode,
    HttpStatusCode.NOT_FOUND,
    'Invalid or expired verification code'
  );

  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    { verified: true },
    { new: true }
  );
  appAssert(
    updatedUser,
    HttpStatusCode.INTERNAL_SERVER_ERROR,
    'Failed to verify email'
  );

  await validCode.deleteOne();

  return {
    user: updatedUser.omitPassword(),
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  const user = await UserModel.findOne({ email });
  appAssert(user, HttpStatusCode.NOT_FOUND, 'User not found');

  const count = await VerificationCodeModel.countDocuments({
    userId: user.id,
    type: VerificationCodeType.PasswordReset,
    createdAt: subtractMinutes(5),
  });
  appAssert(
    count <= 1,
    HttpStatusCode.TOO_MANY_REQUESTS,
    'Too many requests, please try again later'
  );

  const expiresAt = addDays(1);
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    expiresAt,
  });

  const url = `${APP_ORIGIN}/password/reset?code=${
    verificationCode._id
  }&exp=${expiresAt.getTime()}`;

  const { data, error } = await sendMail({
    to: user.email,
    ...getPasswordResetEmailTemplate(url),
  });
  appAssert(
    data?.id,
    HttpStatusCode.INTERNAL_SERVER_ERROR,
    `${error?.message}`
  );

  return {
    url,
    emailId: data.id,
  };
};

export const resetUserPassword = async (
  verificationCode: mongoose.Types.ObjectId,
  password: string
) => {
  const validCode = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: VerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });
  appAssert(
    validCode,
    HttpStatusCode.NOT_FOUND,
    'Invalid or expired verification code'
  );

  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    { password: await hashPassword(password) },
    { new: true }
  );
  appAssert(
    updatedUser,
    HttpStatusCode.INTERNAL_SERVER_ERROR,
    'Failed to reset password'
  );

  await validCode.deleteOne();

  await SessionModel.deleteMany({
    userId: updatedUser._id,
  });

  return {
    user: updatedUser.omitPassword(),
  };
};
