import { useEffect, useState } from "react";
import AppRouter from "./router/Router";
import { AuthContext } from "./contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import style from './css/style.module.scss';

function App() {
  const url = "http://localhost:8000/api";
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    auth: false,
    username: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${url}/auth/profile`, {
        withCredentials: true,
      })
      .then((res) => {
        setUserData((prev) => ({
          ...prev,
          auth: true,
          username: res.data.username,
          email: res.data.email,
        }));

        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setUserData({
          auth: false,
          username: "",
          email: "",
        });

        setLoading(false);
        console.log("#####");
      });
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ userData, setUserData, loading, setLoading, navigate }}
    >
      <AppRouter />
    </AuthContext.Provider>
  );
}

export default App;
