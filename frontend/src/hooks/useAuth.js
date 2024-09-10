import { useQuery } from '@tanstack/react-query';
import { getUser } from '../lib/api';

export const AUTH = 'auth';

const useAuth = () => {
  const { data: user, ...rest } = useQuery({
    queryKey: [AUTH],
    queryFn: getUser,
    staleTime: Infinity,
  });

  return {
    user,
    ...rest,
  };
};

export default useAuth;
