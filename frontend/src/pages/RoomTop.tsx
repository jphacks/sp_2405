import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from '../css/pages/room_top.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

// RoomDataを手動で設定
/*
const RoomData = {
  roomName: "ジョルダン標準形を覚える会",
  roomOwner: "misaizu",
  roomIcon: "frontend/src/components/test_img/Uuekun.png",
  roomMembers: 5,
  roomMembersName: ["misaizu", "Uuekun", "kazuki", "yamada", "suzuki"],
  roomMembersIcon: ["A.png", "B.png", "C.png", "D.png", "E.png"],
  roomStartTime: "2024/10/27 13:42:50", // 手動で設定
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
*/
type UserType = {
  username: string,
  img: string,
}

type ProgressType = {
  progressId: string,
  user: UserType,
  cycle: number,
  time: Date,
  rating: number,
  comment: string,
  likes: number,
}

type RawProgressType = {
  user_id: string,
  start: string,
  progress_eval: number,
  progress_comment: string,
  progress_id: string,
  room_id: string,
  reaction: string[],
}

type RoomDataType = {
  title: string,
  description: string,
  cycleNum: number,
  cycleCurrent: number,
  startAt: Date,
  users: UserType[],
  progress: ProgressType[],
  roomId: string,
}

ChartJS.register(ArcElement, Tooltip, Legend);

const RoomTop: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(0); // 0: Waiting, 1: Focus, 2: Rest Start, 3: Rest Review
  const [remainingTime, setRemainingTime] = useState<number>(0); // 残り時間（秒）
  const [remainingCycles, setRemainingCycles] = useState<number>(0);
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false); // ページ2でボタンが押されたか

  const [room, setRoom] = useState<RoomDataType>({
    roomId: '',
    title: '',
    description: '',
    cycleNum: 99,
    cycleCurrent: 0,
    startAt: new Date(Date.now()),
    users: [],
    progress: [],
  });

  const focusDuration = 30; // テスト用: 集中時間（秒）
  const restDuration = 60; // テスト用: 休憩時間（秒）
  const totalCycleTime = focusDuration + restDuration; // 各サイクルの総時間（秒）

  // roomStartTimeをDateオブジェクトに変換
  const [roomStartTimestamp, setRoomStartTimestamp] = useState(Date.now());
  // const roomStartTimestamp = new Date(RoomData.roomStartTime).getTime();

  // 現在の状態を計算する関数
  const calculateState = useCallback(() => {
    const now = Date.now();
    if(roomStartTimestamp !== room.startAt.getTime()){
      setRoomStartTimestamp(room.startAt.getTime());
    }

    if (now < roomStartTimestamp) {
      // ページ0: 開始待機
      const timeToStart = Math.ceil((roomStartTimestamp - now) / 1000);
      setCurrentPage(0);
      setRemainingTime(timeToStart);
      return;
    }

    const elapsedTime = Math.floor((now - roomStartTimestamp) / 1000); // 経過秒数
    // console.log(room.startAt.getTime());
    // console.log(roomStartTimestamp);

    const totalTime = room.cycleNum * totalCycleTime;

    if (elapsedTime >= totalTime) {
      // 全サイクル終了
      navigate("/");
      return;
    }

    const currentCycle = Math.floor(elapsedTime / totalCycleTime) + 1;
    const cycleTime = elapsedTime % totalCycleTime;

    setRemainingCycles(room.cycleNum - currentCycle + 1);

    if (cycleTime < focusDuration) {
      // ページ1: 集中時間
      setCurrentPage(1);
      setIsButtonPressed(false);
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
  }, [isButtonPressed, navigate, room]);

  // タイマーを設定
  useEffect(() => {
    calculateState(); // 初回計算

    const interval = setInterval(() => {
      calculateState();
    }, 1000); // 1秒ごとに更新

    return () => clearInterval(interval);
  }, [calculateState]);

  // websocket接続部
  const socketRef = useRef<WebSocket>();
  const { userData } = useContext(AuthContext);

  const fetchRoom = async () => {
    const res = await axios.get('http://localhost:8000/api/get_room', {withCredentials: true})
    // console.log(res.data);
    const raw_room = res.data.room;
    const raw_progress: RawProgressType[] = res.data.progress;
    // console.log(raw_progress);

    const data: RoomDataType = {
      roomId: raw_room.room_id,
      title: raw_room.title,
      description: raw_room.description,
      cycleNum: raw_room.cycle_num,
      cycleCurrent: raw_room.cycle_current,
      startAt: new Date(raw_room.start_at),
      users: [],
      progress: raw_progress.map((elem: RawProgressType): ProgressType => {
        return {
          user: {
            username: 'misaizu',
            img: '/sample_avatar.png',
          },
          progressId: elem.progress_id,
          rating: elem.progress_eval,
          comment: elem.progress_comment,
          likes: elem.reaction.length,
          cycle: 1,
          time: new Date(Date.now()),
        }
      }),
    }

    setRoom(data);

    // console.log('ppp');
  }

  useEffect(() => {
    const params = new URLSearchParams({user_id: userData.user_id});
    const ws = new WebSocket(
      `ws://localhost:8000/api/ws/room?${params.toString()}`
    );

    socketRef.current = ws;
    ws.onerror = (error) => {
      console.error("WebSocket接続エラー:", error);
      navigate('/')
    };
    ws.onmessage = (e) => {
      console.log(JSON.parse(e.data));
      // console.log(rows);
      const raw = JSON.parse(e.data);
      const data: ProgressType = {
        progressId: raw.progress_id,
        user: {
          username: 'misaizu',
          img: '/sample_avatar.png',
        },
        cycle: 1,
        time: new Date(raw.start),
        rating: raw.progress_eval,
        comment: raw.progress_comment,
        likes: 0,
      };

      setRoom({
        ...room,
        progress: [data, ...room.progress,]
      })
    };

    fetchRoom();
    calculateState();

    return () => {

      if (ws.readyState === 1) {
        ws.close();
      }
    };
  }, []);


  // 残り時間をフォーマットする関数
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // ページ2のステート
  const [rating, setRating] = useState<number>(5); // 進捗度合い
  const [comment, setComment] = useState<string>(''); // 進捗コメント

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
          {room.title}
        </h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
          {room.users.map((user) => (
            <img
              key={user.username}
              src={user.img}
              alt={`User Icon ${user.username}`}
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
          ))}
        </div>
        <div style={{ position: 'relative', width: '400px', height: '400px' }}>
          <Doughnut
            data={{
              datasets: [
                {
                  data: [focusDuration/5 , remainingTime,  focusDuration - remainingTime],
                  backgroundColor: [
                    `rgba(255, 255, 255, 0.1)`,
                    `rgba(0, 255, 0, 0.8)`,
                    'rgba(0, 0, 0, 0.3)',
                  ],
                  hoverBackgroundColor: [
                    `gradient(from 210deg, #36A2EB ${((focusDuration - remainingTime) / focusDuration) * 100}%, #FF6384 0%)`,
                    'rgba(0, 0, 0, 0.3)',
                  ],
                  borderWidth: 0,
                },
              ],
            }}
            options={{
                cutout: '85%',
              rotation: 150, // 7時方向からスタート
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  enabled: false,
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
              textShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            {formatTime(remainingTime)}
          </div>
        </div>
      </div>
      <Link to="/" className={styles.exitButton_1}>
        <div className={styles.logoutIconContainer}>
          <LogoutIcon/>
        </div>
      </Link>
    </div>
  );

  const renderPage2 = () => (
    <div className={styles.main} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <h2 className={styles.subtitle} style={{ fontSize: '2em', marginBottom: '20px' }}>お疲れさまでした！</h2>
      <p className={styles.description} style={{ fontSize: '1.2em', marginBottom: '40px' }}>進捗の評価・やったことをコメントしてみましょう！</p>

      <div className={styles.ratingSection} style={{ width: '80%', maxWidth: '600px', marginBottom: '40px' }}>
        <h2 className={styles.label} style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '1.3em' }}>進捗</h2>

        {/* スライダーの上に評価ラベル */}
        <div className={styles.ratingLabels} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1em', marginBottom: '10px' }}>
          <span>はかどらなかった...</span>
          <span>はかどった！</span>
        </div>

        {/* スライダー本体 */}
        <input
          type="range"
          id="rating"
          name="rating"
          min="0"
          max="10"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className={styles.slider}
          style={{ width: '100%', marginBottom: '20px' }}
        />

        {/* 0, 5, 10 の下に線と数字 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', width: '100%' }}>
          {[0, 5, 10].map((value) => (
            <div key={value} style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ width: '1px', height: '10px', backgroundColor: '#000', margin: '0 auto' }}></div>
              <span style={{ fontSize: '0.9em', marginTop: '5px' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.commentSection} style={{ width: '80%', maxWidth: '600px', marginBottom: '40px' }}>
        <h2 className={styles.label} style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '1.3em' }}>進捗コメント</h2>
        <textarea
          id="comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={styles.textarea}
          style={{ width: '100%', height: '150px', padding: '10px', fontSize: '1em', borderRadius: '8px', border: '1px solid #ccc' }}
        />
      </div>

      <button
        className={styles.submitButton}
        onClick={async () => {
          const data = {
            user_id: userData.user_id,
            start: Date.now(),
            progress_eval: rating,
            progress_comment: comment,
            room_id: room.roomId,
          }
          const res = await axios.post('http://localhost:8000/api/ws/save_progress', data, {withCredentials: true})
          console.log(res);
          // ここでbackendに送信する処理を行う
          // fetch('/api/submit', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({ rating, comment }),
          // })
          //   .then(response => response.json())
          //   .then(data => console.log(data))
          //   .catch(error => console.error('Error:', error));

          // ボタン押下後、Page3に遷移する
          setIsButtonPressed(true);
        }}
        style={{ backgroundColor: '#4A90E2', color: 'white', fontSize: '1.2em', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
      >
        送信
      </button>
    </div>
  );

  const renderPage3 = () => (
    <div className={styles.main}>
        <header className={styles.header}>
          <Link to="/" className={styles.exitButton}>
            <div className={styles.logoutIconContainer}>
              <LogoutIcon />
            </div>
          </Link>
          <div className={styles.cycleInfo}>
            <span>残り {remainingCycles - 1} サイクル</span>
            <span>次のサイクルまで {formatTime(remainingTime)}</span>
          </div>
        </header>
        <h2 className={styles.subtitle}>{room.title}</h2>
        <p>残り時間: {formatTime(remainingTime)}</p>
        <div className={styles.cardContainer}>
          {room.progress
            // .sort((p) => new Date(p.date).getTime() - new Date(a.date).getTime())
            .map((elem) => (
              <div key={elem.progressId} className={styles.card}>
                <p className={styles.username}>
                  <img src={elem.user.img} alt={elem.user.username} className={styles.userIcon} />
                  {elem.user.username}
                </p>
                <p className={styles.cycle}>Cycle {elem.cycle}</p>
                <p className={styles.time}>{elem.time.toISOString()}</p>
                <div className={styles.rating}>
                  {[...Array(10)].map((_, i) => (
                    <span key={i} className={i < elem.rating ? styles.full : styles.empty}>●</span>
                  ))}
                </div>
                <p className={styles.comment}>{elem.comment}</p>
                <p className={styles.likes}>❤️ {elem.likes}</p>
              </div>
            ))}
        </div>
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
        return renderPage2();
      case 3:
        return renderPage3();
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
