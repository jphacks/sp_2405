import React from 'react'
import style from '../css/style.module.scss'
import findRoom from '../css/components/find_room.module.scss'

const FindRoom = () => {
  return (
    <>
      <div className={findRoom.header}></div>
      <div className={style.main}>
        <h1 className={style.title}>部屋を探す</h1>
      </div>
    </>
  );
}

export default FindRoom
