import React from "react";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Legend } from "recharts";
import style from "../css/style.module.scss";
import analysis from "../css/components/analysis.module.scss";

// 仮の総時間と総サイクル数を定義
const todayStats = { totalTime: "2:30", totalCycles: 5 };
const totalStats = { totalTime: "172:30", totalCycles: 345 };

// 仮のデータを定義（バックエンドから取得される想定のデータ）
const todayData = [
  { name: "study", value: 50 },
  { name: "programming", value: 30 },
  { name: "writing", value: 20 },
];

const totalData = [
  { name: "study", value: 33 },
  { name: "programming", value: 33 },
  { name: "writing", value: 33 },
  { name: "other", value: 1 },
];


// 各タグの色を返す配列
const COLORS = ["#ff9999", "#ffcc99", "#ffff99", "#ccff99", "#99ff99", "#99ffcc", "#99ffff", "#99ccff", "#9999ff", "#cc99ff"];

// 仮のデータ（バックエンドから受け取る想定）
const userData = [
  {
    username: "misaizu",
    userIcon: "frontend/src/components/test_img/Uuekun.png", // ユーザアイコンのパス
    cycle: 1,
    date: "2024/10/15 23:00 - 23:25",
    rating: 6,
    comment: "締め作業の勉強をしました！ずっとわからなかったジョルダン標準形がちょっとわかってきたかも！",
    likes: 2,
  },
  {
    username: "misaizu",
    userIcon: "test_img/Uuekun.png",
    cycle: 2,
    date: "2024/10/31 22:00 - 22:30",
    rating: 8,
    comment: "プログラミングの練習をしました。",
    likes: 5,
  },
];

// 仮のグリッドデータ、日付と時間のラベル
const gridData = Array(30).fill(null).map(() =>
  Array(8).fill(0).map(() => Math.floor(Math.random() * 5))
);
const timeLabels = [
  "00:00-03:00", "03:00-06:00", "06:00-09:00", "09:00-12:00",
  "12:00-15:00", "15:00-18:00", "18:00-21:00", "21:00-24:00"
];

const dateLabels = Array.from({ length: 30 }, (_, i) => `10/${i + 1}`);

const Analysis = () => {
  return (
    <>
      <div className={style.main}>
        <h1 className={style.title}>自己分析</h1>

        <div className={analysis.content}>
          {/* 今日の取り組み */}
          <h2 className={analysis.subtitle}>今日の取り組み</h2>
          <div className={analysis.chart}>
            <Box position="relative" display="inline-flex" justifyContent="center" alignItems="center">
              <PieChart width={300} height={300}>
                <Pie
                  data={todayData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  startAngle={90}
                  endAngle={-270}
                  fill="#8884d8"
                  skipAnimation
                >
                  {todayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
              <Box
                position="absolute"
                width={160}
                height={160}
                borderRadius="50%"
                top="23%"
                left="23.2%"
                bgcolor="white"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="h6" align="center">
                  総時間: {todayStats.totalTime}<br />
                  総サイクル数: {todayStats.totalCycles}
                </Typography>
              </Box>
            </Box>

            <ul className={analysis.chartLegend}>
              {todayData.map((entry, index) => (
                <li key={entry.name}>
                  <span style={{ backgroundColor: COLORS[index % COLORS.length] }}></span> 
                  {entry.name} ({entry.value}%)
                </li>
              ))}
            </ul>
          </div>

          {/* これまでの取り組み */}
          <h2 className={analysis.subtitle}>これまでの取り組み</h2>
          <div className={analysis.chart}>
            <Box position="relative" display="inline-flex" justifyContent="center" alignItems="center">
              <PieChart width={300} height={300}>
                <Pie
                  data={totalData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  startAngle={90}
                  endAngle={-270}
                  fill="#8884d8"
                  skipAnimation
                >
                  {totalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
              <Box
                position="absolute"
                width={160}
                height={160}
                borderRadius="50%"
                top="23.2%"
                left="23.2%"
                bgcolor="white"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="h6" align="center">
                  総時間: {totalStats.totalTime}<br />
                  総サイクル数: {totalStats.totalCycles}
                </Typography>
              </Box>
            </Box>

            <ul className={analysis.chartLegend}>
              {totalData.map((entry, index) => (
                <li key={entry.name}>
                  <span style={{ backgroundColor: COLORS[index % COLORS.length] }}></span> 
                  {entry.name} ({entry.value}%)
                </li>
              ))}
            </ul>
          </div>
          <h2 className={analysis.subtitle}>取り組んだ内容</h2>
          <div className={analysis.cardContainer}>
            {userData
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // 日付順に並べ替え
              .map((user, index) => (
                <div key={index} className={analysis.card}>
                  <p className={analysis.username}>
                    <img src={user.userIcon} alt={user.username} className={analysis.userIcon} />
                    {user.username}
                  </p>
                  <p className={analysis.cycle}>Cycle{user.cycle}</p>
                  <p className={analysis.time}>{user.date}</p>
                  <div className={analysis.rating}>
                    {[...Array(10)].map((_, i) => (
                      <span key={i} className={i < user.rating ? analysis.full : analysis.empty}>●</span>
                    ))}
                  </div>
                  <p className={analysis.comment}>{user.comment}</p>
                  <p className={analysis.likes}>❤️ {user.likes}</p>
                </div>
              ))}
          </div>

          <h2 className={analysis.subtitle}>今月の成果</h2>
          <div className={analysis.cardContainer}>
            <div className={analysis.contributionWrapper}>
              <div className={analysis.contributionGraph}>
                <div className={analysis.dateLabels}>
                  <span className={analysis.emptyCell}></span> {/* 左上の空白 */}
                  {dateLabels.map((date, index) => (
                    <span key={index} className={analysis.date}>
                      {(index === 0 || index === 10 || index === 20) ? date : ""}
                    </span>
                  ))}
                </div>

                <div className={analysis.graphBody}>
                  {timeLabels.map((time, timeIndex) => (
                    <div key={timeIndex} className={analysis.week}>
                      <span className={analysis.timeLabel}>{time}</span>
                      {gridData.map((week, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`${analysis.day} ${analysis[`contribution-${week[timeIndex]}`]}`}
                          title={`Day ${dayIndex + 1}: ${week[timeIndex]} contributions`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* 色の度合いの凡例 */}
              <div className={analysis.legendWrapper}>
                <span className={analysis.legendTitle}>集中度</span>
                <div className={analysis.legend}>
                  less
                  <span className={`${analysis.legendColor} ${analysis['contribution-0']}`}></span>
                  <span className={`${analysis.legendColor} ${analysis['contribution-1']}`}></span>
                  <span className={`${analysis.legendColor} ${analysis['contribution-2']}`}></span>
                  <span className={`${analysis.legendColor} ${analysis['contribution-3']}`}></span>
                  <span className={`${analysis.legendColor} ${analysis['contribution-4']}`}></span> more
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analysis;
