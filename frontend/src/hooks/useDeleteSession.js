import { useMutation } from '@tanstack/react-query';
import { deleteSession } from '../lib/api';
import queryClient from '../config/queryClient';
import { SESSIONS } from './useSessions';

const useDeleteSession = (sessionId) => {
  const { mutate, ...rest } = useMutation({
    mutationFn: () => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.setQueryData([SESSIONS], (sessions) =>
        sessions.filter((session) => session._id !== sessionId)
      );
    },
  });

  return {
    deleteSession: mutate,
    ...rest,
  };
};

export default useDeleteSession;
