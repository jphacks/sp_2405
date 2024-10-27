import React, { useState, useEffect, useCallback } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
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
  roomStartTime: "2024/10/27 10:04:50", // 手動で設定
  roomCycles: 3,
  userData: [
    {
      username: "misaizu",
      userIcon: "frontend/src/components/test_img/Uuekun.png",
      cycle: 1,
      date: "2024/2/29 23:00 - 23:25",
      rating: 8,
      comment: "線形代数の勉強をしました！すごくわかりやすかった♪シュルダン環構造がちょっとわかってきたかも！",
      likes: 2,
    },
    {
      username: "misaizu",
      userIcon: "frontend/src/components/test_img/Uuekun.png",
      cycle: 1,
      date: "2024/2/29 23:00 - 23:25",
      rating: 7,
      comment: "線形代数の勉強をしました！すごくわかりやすかった♪シュルダン環構造がちょっとわかってきたかも！",
      likes: 1,
    },
  ],
};

ChartJS.register(ArcElement, Tooltip, Legend);

const RoomTop: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(0); // 0: Waiting, 1: Focus, 2: Rest Start, 3: Rest Review
  const [remainingTime, setRemainingTime] = useState<number>(0); // 残り時間（秒）
  const [remainingCycles, setRemainingCycles] = useState<number>(RoomData.roomCycles);
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false); // ページ2でボタンが押されたか

  const focusDuration = 15; // テスト用: 集中時間（秒）
  const restDuration = 5; // テスト用: 休憩時間（秒）
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

  // 残り時間をフォーマットする関数
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // ページ0の内容
  const renderPage0 = () => (
    <div
      style={{
        backgroundImage: `url('/welcome_image.jpg')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100vh',
        position: 'relative',
      }}
    >
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          flexDirection: 'column', // テキストを縦に並べるためにflex方向を縦に
        }}
      >
        <h2
          style={{
            fontSize: '9em', // フォントサイズ変更可能
            color: '#00BFFF',
            fontFamily: 'Arial, sans-serif', // フォント変更可能
            lineHeight: '3em', // 行間を設定
            margin: '0', // 上下余白をなくす
          }}
        >
          Starting Soon!
        </h2>
        <p
          style={{
            fontSize: '7em', // フォントサイズ変更可能
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'Arial, sans-serif', // フォント変更可能
            lineHeight: '1.2em', // 行間を設定
            margin: '0', // 上下余白をなくす
          }}
        >
          {formatTime(remainingTime)}
        </p>
      </div>
    </div>
  );

  // ページ1の内容
  const renderPage1 = () => (
    <div
      className={styles.main}
      style={{
        backgroundImage: `url('/welcome_image.jpg')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100vh',
        position: 'relative',
      }}
    >
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      >
        <h2
          style={{
            fontSize: '4em',
            color: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            marginBottom: '20px',
          }}
        >
          {RoomData.roomName}
        </h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
          {RoomData.roomMembersIcon.map((icon, index) => (
            <img
              key={index}
              src={icon}
              alt={`User Icon ${index}`}
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
          ))}
        </div>
        <div style={{ position: 'relative', width: '400px', height: '400px' }}>
          <Doughnut
            data={{
              datasets: [
                {
                  data: [remainingTime, focusDuration - remainingTime],
                  backgroundColor: ['#36A2EB', '#FF6384'],
                  hoverBackgroundColor: ['#36A2EB', '#FF6384'],
                },
              ],
            }}
            options={{
              cutout: '85%',
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '3em',
              color: 'white',
            }}
          >
            {formatTime(remainingTime)}
          </div>
        </div>
      </div>
      <Link to="/" className={styles.exitButton}>
        <div className={styles.logoutIconContainer}>
          <LogoutIcon/>
        </div>
      </Link>
    </div>
  );


  // ページのレンダリング
  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return renderPage0();
      case 1:
        return renderPage1();
      case 2:
        return (
          <div className={styles.main}>
            <h2>ページ2: 休憩開始</h2>
            <p className={`${styles.timer} ${styles.monospace}`}>残り時間: {formatTime(remainingTime)}</p>
            <button onClick={() => setIsButtonPressed(true)}>送信</button>
            {/* ページ2の内容 */}
          </div>
        );
      case 3:
        return (
          <div className={styles.main}>
            <header className={styles.header}>
              <div className={styles.cycleInfo}>
                <span>残り {remainingCycles - 1} サイクル</span>
                <span>次のサイクルまで {formatTime(remainingTime)}</span>
              </div>
            </header>
            <h2 className={styles.subtitle}>{RoomData.roomName}</h2>
            <p className={`${styles.timer} ${styles.monospace}`}>残り時間: {formatTime(remainingTime)}</p>
            {/* ページ3の内容 */}
            <div className={styles.logoutIconContainer}>
              <LogoutIcon/>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className={styles.main}>{renderPage()}</div>;
};

export default RoomTop;
