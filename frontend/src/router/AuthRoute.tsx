import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
// import Login from "../../components/auth/Login";
// import Signup from "../../components/auth/Signup";
// import Auth from "../../pages/Auth";

const AuthRoute = () => {
  return (
    <Routes>
      {/* <Route path="" element={<Auth />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="" element={<Navigate to="login" replace />} />
      </Route> */}
    </Routes>
  );
};

export default AuthRoute;
