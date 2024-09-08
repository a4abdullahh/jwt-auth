import HttpStatusCode from '../constants/httpStatusCode';
import UserModel from '../models/user.model';
import appAssert from '../utils/appAssert';
import asyncHandler from '../utils/asyncHandler';

export const getUserHandler = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, HttpStatusCode.NOT_FOUND, 'User not found');
  return res.status(HttpStatusCode.OK).json(user.omitPassword());
});
