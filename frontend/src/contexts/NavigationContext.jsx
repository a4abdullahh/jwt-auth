import { createContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const NavigationContext = createContext();

/* eslint-disable react/prop-types */
export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();

  return (
    <NavigationContext.Provider value={{ navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};
