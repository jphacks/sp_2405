import React, { useState } from 'react'
import style from '../css/style.module.scss'
import findRoom from '../css/components/find_room.module.scss'
import { NavLink } from 'react-router-dom'
import { Button } from '@mui/material'

const FindRoom = () => {
  const rooms: RoomType[] = [
    {
      roomId: "aaa",
      title: "数学を頑張る部屋",
      description: "集中して一緒に学びましょう！",
      startAt: new Date("2024/10/26 11:45:00"),
      cycleNum: 3,
      cycleCurrent: 2,
      tag: "study",
      img: "/sample_room.JPG",
      user_imgs: ["/sample_avatar.png"],
    },
  ];

  type RoomType = {
    roomId: string,
    title: string,
    description: string,
    startAt: Date,
    cycleNum: number,
    cycleCurrent: number,
    tag: string,
    img: string,
    user_imgs: string[],
  }

  const convertTime = (time: Date) => {
    return time.toLocaleString('ja');
  };

  const [modalRoom, setModalRoom] = useState<RoomType>({} as RoomType);

  return (
    <>
      <div className={findRoom.header}>
        
      </div>
      <div className={style.main}>
        <h1 className={style.title}>部屋を探す</h1>
        <h2 className={findRoom.subtitle}>Active rooms</h2>
        <ul className={findRoom.roomList}>
          {rooms.map((room) => (
            <li className={findRoom.roomListItem}>
              <button
                type="button"
                // width='100%'
                className={findRoom.roomListLink}
              >
                <div className={findRoom.roomListItemImg}>
                  <img src={room.img} alt="" />
                </div>
                <div className={findRoom.roomListItemContent}>
                  <h1 className={findRoom.roomListItemContentTitle}>
                    {room.title}
                  </h1>
                  <p className={findRoom.roomListItemContentTag}>{room.tag}</p>
                  <p className={findRoom.roomListItemContentNormal}>
                    {convertTime(room.startAt)}開始
                  </p>
                  <div className={findRoom.roomListItemContentFlex}>
                    <div>
                      <div className={findRoom.roomListItemContentFlex}>
                        <p className={findRoom.roomListItemContentBold}>
                          {room.cycleCurrent}/{room.cycleNum}
                        </p>
                        <p className={findRoom.roomListItemContentNormal}>
                          サイクル
                        </p>
                      </div>
                      <div className={findRoom.roomListItemContentFlex}>
                        <p className={findRoom.roomListItemContentBold}>
                          {room.user_imgs.length}名
                        </p>
                        <p className={findRoom.roomListItemContentNormal}>
                          参加中
                        </p>
                      </div>
                    </div>
                    <div className={findRoom.roomListItemContentUsers}></div>
                  </div>
                </div>
                <div className={findRoom.roomListItemDescription}>
                  <p>{room.description}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default FindRoom
