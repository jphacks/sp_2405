import React, { useState, useEffect, useCallback } from 'react';
import styles from '../css/pages/room_top.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

// RoomDataを手動で設定
const RoomData = {
  roomName: "数学を頑張る部屋",
  roomOwner: "misaizu",
  roomIcon: "frontend/src/components/test_img/Uuekun.png",
  roomMembers: 5,
  roomMembersName: ["misaizu", "Uuekun", "kazuki", "yamada", "suzuki"],
  roomMembersIcon: ["A.png", "B.png", "C.png", "D.png", "E.png"],
  roomStartTime: "2024/10/26 23:08:50", // 手動で設定
  roomCycles: 3,
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

type RoomDataType = typeof RoomData;

const RoomTop: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(0); // 0: Waiting, 1: Focus, 2: Rest Start, 3: Rest Review
  const [remainingTime, setRemainingTime] = useState<number>(0); // 残り時間（秒）
  const [remainingCycles, setRemainingCycles] = useState<number>(RoomData.roomCycles);
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false); // ページ2でボタンが押されたか

  const focusDuration = 15; // テスト用: 集中時間（秒）
  const restDuration = 5;   // テスト用: 休憩時間（秒）
  const totalCycleTime = focusDuration + restDuration; // 各サイクルの総時間（秒）

  // roomStartTimeをDateオブジェクトに変換
  const roomStartTimestamp = new Date(RoomData.roomStartTime).getTime();

  // 現在の状態を計算する関数
  const calculateState = useCallback(() => {
    const now = Date.now();

    if (now < roomStartTimestamp) {
      // ページ0: 開始待機
      const timeToStart = Math.ceil((roomStartTimestamp - now) / 1000);
      setCurrentPage(0);
      setRemainingTime(timeToStart);
      return;
    }

    const elapsedTime = Math.floor((now - roomStartTimestamp) / 1000); // 経過秒数
    const totalTime = RoomData.roomCycles * totalCycleTime;

    if (elapsedTime >= totalTime) {
      // 全サイクル終了
      navigate('/');
      return;
    }

    const currentCycle = Math.floor(elapsedTime / totalCycleTime) + 1;
    const cycleTime = elapsedTime % totalCycleTime;

    setRemainingCycles(RoomData.roomCycles - currentCycle + 1);

    if (cycleTime < focusDuration) {
      // ページ1: 集中時間
      setCurrentPage(1);
      setRemainingTime(focusDuration - cycleTime);
    } else {
      // 休憩時間
      const restElapsed = cycleTime - focusDuration;
      const remainingRestTime = restDuration - restElapsed;

      if (isButtonPressed) {
        // ページ3: 休憩レビュー
        setCurrentPage(3);
        setRemainingTime(remainingRestTime);
      } else {
        // ページ2: 休憩開始
        setCurrentPage(2);
        setRemainingTime(remainingRestTime);
      }
    }
  }, [isButtonPressed, navigate]);

  // タイマーを設定
  useEffect(() => {
    calculateState(); // 初回計算

    const interval = setInterval(() => {
      calculateState();
    }, 1000); // 1秒ごとに更新

    return () => clearInterval(interval);
  }, [calculateState]);

  // ページ3からの遷移を管理
  useEffect(() => {
    if (currentPage === 3) {
      // ページ3表示中のタイマー
      if (remainingTime <= 0) {
        // タイマー終了時
        if (remainingCycles > 1) {
          setIsButtonPressed(false);
          setCurrentPage(1); // 次のサイクルのページ1へ
        } else {
          navigate('/'); // 全サイクル終了後ホームへ
        }
      }
    }

    // ページ2で5秒間ボタンが押されなかった場合に自動的にページ1へ戻る
    if (currentPage === 2 && remainingTime <= 0) {
      if (remainingCycles > 1) {
        setIsButtonPressed(false);
        setCurrentPage(1); // 次のサイクルのページ1へ
      } else {
        navigate('/'); // 全サイクル終了後ホームへ
      }
    }
  }, [currentPage, remainingTime, remainingCycles, navigate]);

  // ボタン押下時の処理
  const handleButtonPress = () => {
    if (currentPage === 2) {
      setIsButtonPressed(true);
      setCurrentPage(3);
    }
  };

  // 残り時間をフォーマットする関数
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // ページのレンダリング
  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <div className={styles.main}>
            <h2>ちょっと待ってね</h2>
            <p className={`${styles.timer} ${styles.monospace}`}>開始まで: {formatTime(remainingTime)}</p>
            {/* ページ0の内容 */}
          </div>
        );
      case 1:
        return (
          <div className={styles.main}>
            <h2>ページ1: 集中時間</h2>
            <p className={`${styles.timer} ${styles.monospace}`}>残り時間: {formatTime(remainingTime)}</p>
            {/* ページ1の内容 */}
          </div>
        );
      case 2:
        return (
          <div className={styles.main}>
            <h2>ページ2: 休憩開始</h2>
            <p className={`${styles.timer} ${styles.monospace}`}>残り時間: {formatTime(remainingTime)}</p>
            <button onClick={handleButtonPress}>ページ3へ</button>
            {/* ページ2の内容 */}
          </div>
        );
      case 3:
        return (
          <div className={styles.main}>
            <header className={styles.header}>
              <Link to="/" className={styles.exitButton}>
                <div className={styles.logoutIconContainer}>
                  <LogoutIcon style={{ transform: 'rotate(180deg)' }} />
                </div>
              </Link>
              <div className={styles.cycleInfo}>
                <span>残り {remainingCycles - 1} サイクル</span>
                <span>次のサイクルまで {formatTime(remainingTime)}</span>
              </div>
            </header>
            <h2 className={styles.subtitle}>{RoomData.roomName}</h2>
            <p className={`${styles.timer} ${styles.monospace}`}>残り時間: {formatTime(remainingTime)}</p>
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
      default:
        return null;
    }
  };

  return (
    <div className={styles.main}>
      {renderPage()}
    </div>
  );
};

export default RoomTop;
