import React, { useContext } from 'react';
import { Navigate, Route } from 'react-router-dom'
import Chat from '../Pages/Chat';

function PrivateRoute({ component: Component, ...rest }) {
  // const { isLoggedIn } = useContext;
  return (<Chat />)
}

export default PrivateRoute;