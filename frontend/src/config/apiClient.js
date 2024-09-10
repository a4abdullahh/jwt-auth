import axios from 'axios';
import queryClient from './queryClient';
import { useNavigation } from '../hooks/useNavigation';

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

const API = axios.create(options);
const RefreshTokenClient = axios.create(options);

RefreshTokenClient.interceptors.response.use((response) => response.data);

API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { status, data } = error.response;

    if (status === 401 && data?.errorCode === 'InvalidAccessToken') {
      try {
        await RefreshTokenClient.get('/auth/refresh');
        return RefreshTokenClient(error.config);
      } catch (error) {
        const { navigate } = useNavigation();
        navigate('/login', {
          state: {
            redirectUrl: window.location.pathname,
          },
        });
        queryClient.clear();
      }
    }

    return Promise.reject({ status, ...data });
  }
);

export default API;
