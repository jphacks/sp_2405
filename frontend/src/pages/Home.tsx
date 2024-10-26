import React from 'react'
import { Search, AddCircleOutline, Person, AnalyticsOutlined, Settings, Logout } from "@mui/icons-material";
import home from '../css/pages/home.module.scss';
import { NavLink, Outlet } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className={home.wrapper}>
        <div className={home.sidebar}>
          <div className={home.sidebarCol}>
            <p className={home.sidebarColTitle}>Room</p>
            <ul className={home.sidebarColList}>
              <li className={home.sidebarColListItem}>
                <NavLink
                  to="/home/find_room"
                  className={home.sidebarColListItemNavLink}
                >
                  <div className={home.sidebarColListItemIcon}>
                    <Search />
                  </div>
                  <p className={home.sidebarColListItemText}>部屋を探す</p>
                </NavLink>
              </li>
              <li className={home.sidebarColListItem}>
                <div className={home.sidebarColListItemIcon}>
                  <AddCircleOutline />
                </div>
                <p className={home.sidebarColListItemText}>部屋を作る</p>
              </li>
            </ul>
          </div>
          <div className={home.sidebarCol}>
            <p className={home.sidebarColTitle}>About</p>
            <ul className={home.sidebarColList}>
              <li className={home.sidebarColListItem}>
                <div className={home.sidebarColListItemIcon}>
                  <Person />
                </div>
                <p className={home.sidebarColListItemText}>プロフィール</p>
              </li>
              <li className={home.sidebarColListItem}>
                <NavLink
                  to="/home/analysis"
                  className={home.sidebarColListItemNavLink}
                >
                  <div className={home.sidebarColListItemIcon}>
                    <AnalyticsOutlined />
                  </div>
                  <p className={home.sidebarColListItemText}>自己分析</p>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className={home.sidebarCol}>
            <p className={home.sidebarColTitle}>Miscs</p>
            <ul className={home.sidebarColList}>
              <li className={home.sidebarColListItem}>
                <div className={home.sidebarColListItemIcon}>
                  <Settings />
                </div>
                <p className={home.sidebarColListItemText}>設定</p>
              </li>
              <li className={home.sidebarColListItem}>
                <div className={home.sidebarColListItemIcon}>
                  <Logout />
                </div>
                <p className={home.sidebarColListItemText}>ログアウト</p>
              </li>
            </ul>
          </div>
        </div>

        <div className={home.content}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Home
