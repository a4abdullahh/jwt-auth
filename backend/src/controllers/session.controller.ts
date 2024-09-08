import HttpStatusCode from '../constants/httpStatusCode';
import SessionModel from '../models/session.model';
import { objectIdSchema } from '../schemas/auth.schema';
import appAssert from '../utils/appAssert';
import asyncHandler from '../utils/asyncHandler';

export const getSessionsHandler = asyncHandler(async (req, res) => {
  const sessions = await SessionModel.find(
    {
      userId: req.userId,
      expiresAt: { $gte: new Date() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },
    {
      sort: { createdAt: -1 },
    }
  );

  return res.status(HttpStatusCode.OK).json(
    sessions.map((session) => ({
      ...session.toJSON(),
      ...(session.id === req.sessionId && {
        isActive: true,
      }),
    }))
  );
});

export const deleteSessionHandler = asyncHandler(async (req, res) => {
  const sessionId = objectIdSchema.parse(req.params.id);

  const deleted = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  appAssert(deleted, HttpStatusCode.NOT_FOUND, 'Session not found');

  return res.status(HttpStatusCode.OK).json({
    message: 'Session deleted',
  });
});
