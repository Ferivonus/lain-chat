import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
    const savedUser = Cookies.get('username');  

    console.log("Saved User:", savedUser);  

    if (!savedUser) {
        return <Navigate to="/login" />;  
    }

    return children;
};

export default ProtectedRoute;
