// AccessTokenContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessTokenContext = createContext();

export const AccessTokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  // Load the access token from local storage when the component mounts
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, []);

  // Store the access token in local storage whenever it changes
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
    } else {
      localStorage.removeItem('access_token');
    }
  }, [accessToken]);

  return (
    <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AccessTokenContext.Provider>
  );
};

export const useAccessToken = () => {
  const context = useContext(AccessTokenContext);
  if (!context) {
    throw new Error('useAccessToken must be used within an AccessTokenProvider');
  }
  return context;
};
