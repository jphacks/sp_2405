import React from 'react';
import styles from '../css/pages/room_top.module.scss';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const RoomData = {
  roomName: "数学を頑張る部屋",
  roomOwner: "misaizu",
  roomIcon: "frontend/src/components/test_img/Uuekun.png",
  roomMembers: 5,
  roomMembersName: ["misaizu", "Uuekun", "kazuki", "yamada", "suzuki"],
  roomMembersIcon: ["A.png", "B.png", "C.png", "D.png", "E.png"],
  roomStartTime: "2024/10/15 13:30",
  roomEndTime: "2024/10/15 15:00",
  PredCycleTime: "2024/10/15 13:30 - 13:55",
  roomCycles: 3,
  roomCycleNow: 1,
  NextStartTime: "2024/10/15 14:00",
  TimeToStart: "4:30",
  userData: [
    {
      username: "misaizu",
      userIcon: "frontend/src/components/test_img/Uuekun.png",
      cycle: 1,
      date: "2024/2/29 23:00 - 23:25",
      rating: 8,
      comment: "線形代数の勉強をしました！すごくわかりやすかった♪シュルダン環構造がちょっとわかってきたかも！",
      likes: 2
    },
    {
      username: "misaizu",
      userIcon: "frontend/src/components/test_img/Uuekun.png",
      cycle: 1,
      date: "2024/2/29 23:00 - 23:25",
      rating: 7,
      comment: "線形代数の勉強をしました！すごくわかりやすかった♪シュルダン環構造がちょっとわかってきたかも！",
      likes: 1
    }
  ]
};

const RoomTop = () => {
  return (
    <div className={styles.main}>
      <header className={styles.header}>
      <Link to="../find_room" className={styles.exitButton}>
          <LogoutIcon style={{ transform: 'rotate(180deg)' }} />
        </Link>
        <div className={styles.cycleInfo}>
          <span>残り {RoomData.roomCycles - RoomData.roomCycleNow} サイクル</span>
          <span>次のサイクルまで {RoomData.TimeToStart}</span>
        </div>
      </header>
      <h2 className={styles.subtitle}>{RoomData.roomName}</h2>
      <div className={styles.cardContainer}>
        {RoomData.userData
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((user, index) => (
            <div key={index} className={styles.card}>
              <p className={styles.username}>
                <img src={user.userIcon} alt={user.username} className={styles.userIcon} />
                {user.username}
              </p>
              <p className={styles.cycle}>Cycle {user.cycle}</p>
              <p className={styles.time}>{user.date}</p>
              <div className={styles.rating}>
                {[...Array(10)].map((_, i) => (
                  <span key={i} className={i < user.rating ? styles.full : styles.empty}>●</span>
                ))}
              </div>
              <p className={styles.comment}>{user.comment}</p>
              <p className={styles.likes}>❤️ {user.likes}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RoomTop;
