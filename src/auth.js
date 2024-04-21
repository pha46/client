import React from 'react';
import AuthProvider from 'react-auth-kit'
import RoutesComponent from './Routes';
import createStore from 'react-auth-kit/createStore';

const store = createStore({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'http:',
})

function auth() {
  return (
    <AuthProvider store={store}>
      <RoutesComponent/>
    </AuthProvider>
  );
}

export default auth;