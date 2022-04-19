import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UserContext from './userContext';

function UserProvider({ children }) {

  const [ users, setUsers ] = useState([]);
  const [ user, setUser ] = useState({ id: 0, username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const contextValue = {
    users,
    setUsers,
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
  }

  return (
    <UserContext.Provider value={ contextValue }>
      { children }
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProvider;
