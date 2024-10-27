import { Navigate, Route, Routes } from "react-router-dom";
import Welcome from "../pages/Welcome";
import Login from "../components/Login";
import Register from "../components/Register";

const AuthRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route index element={<Navigate to="login" replace />} />
      </Route>
    </Routes>
  );
};

export default AuthRoute;
