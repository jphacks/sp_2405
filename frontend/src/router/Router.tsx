import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import HomeRoute from "./HomeRoute";
import AuthRoute from "./AuthRoute";

const AppRouter = () => {
  const { userData, loading } = useContext(AuthContext);
  // console.log(loading);

  return (
    <Routes>
      {loading ? (
        <></>
      ) : (
        <>
          <Route path="" element={<Navigate to="/auth" />} />
          <Route
            path="auth/*"
            element={
              <PrivateRoute
                component={<AuthRoute />}
                redirect="/home"
                condition={!userData.auth}
              />
            }
          />
          <Route
            path="home/*"
            element={
              <PrivateRoute
                component={<HomeRoute />}
                redirect="/auth/login"
                condition={userData.auth}
              />
            }
          />
        </>
      )}
    </Routes>
  );
};

export default AppRouter;
