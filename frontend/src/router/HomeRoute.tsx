import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Home from "../pages/Home";
import FindRoom from "../components/FindRoom";
import Analysis from "../components/Analysis";


const HomeRoute = () => {
  return (
    <Routes>
      <Route path="" element={<Home />}>
        <Route path="" element={<Navigate to="find_room" />} />
        <Route path="find_room" element={<FindRoom />} />
        <Route path="analysis" element={<Analysis />} />
      </Route>
      {/* <Route path="room"></Route> */}
    </Routes>
  );
};

export default HomeRoute;
