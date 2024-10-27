import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import FindRoom from "../components/FindRoom";
import Analysis from "../components/Analysis";
import RoomTop from "../pages/RoomTop";


const HomeRoute = () => {
  return (
    <Routes>
      <Route path="" element={<Home />}>
        <Route path="" element={<Navigate to="find_room" />} />
        <Route path="find_room" element={<FindRoom />} />
        <Route path="analysis" element={<Analysis />} />
      </Route>
      {/* <Route path="room"></Route> */}
      <Route path="room" element={<RoomTop />} />
    </Routes>
  );
};

export default HomeRoute;
