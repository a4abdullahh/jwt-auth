import { useContext } from 'react';
import { NavigationContext } from '../contexts/NavigationContext';

export const useNavigation = () => {
  return useContext(NavigationContext);
};
