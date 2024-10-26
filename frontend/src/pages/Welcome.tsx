import React, { useState } from 'react';
import welcome from '../css/pages/welcome.module.scss';
import Login from '../components/Login';
import Register from '../components/Register';
import { Outlet } from 'react-router-dom';

const Welcome = () => {
  const [showRegister, setShowRegister] = useState(false);

  const toggleForm = () => {
    setShowRegister((prev) => !prev);
  };

  return (
    <div className={welcome.wrapper}>
      <div className={welcome.header}>
        <h1 className={welcome.title}>プロダクト名</h1>
        <p className={welcome.subtitle}>みんなで一緒にポモドーロ法、やってみませんか？</p>
      </div>

      <div className={welcome.outletContainer}>
        <Outlet />
      </div>
    </div>
  );
};

export default Welcome;
