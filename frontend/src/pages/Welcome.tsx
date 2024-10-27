import welcome from '../css/pages/welcome.module.scss';
import { Outlet } from 'react-router-dom';

const Welcome = () => {

  return (
    <div className={welcome.wrapper}>
      <div className={welcome.box}>
        <div className={welcome.header}>
          <h1 className={welcome.title}>ぽもとも</h1>
          <p className={welcome.subtitle}>みんなで一緒にポモドーロ法、やってみませんか？</p>
        </div>

        <div className={welcome.outletContainer} >
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default Welcome;
