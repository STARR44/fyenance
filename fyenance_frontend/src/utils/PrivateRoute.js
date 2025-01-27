import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate()

  // Redirect to login if the user is not authenticated
  if (!user) {
    navigate('/login', { replace: true })
  }

  return children;
};

export default PrivateRoute;
