import React, { useEffect, useState } from 'react'
import style from '../css/style.module.scss'
import findRoom from '../css/components/find_room.module.scss'
import { TextField, Button } from '@mui/material'
import { Search, Add } from '@mui/icons-material'
import axios from 'axios'
import CreateRoom from './CreateRoom'

const FindRoom = () => {
  type RoomType = {
    room_id: string,
    title: string,
    description: string,
    start_at: Date,
    cycle_num: number,
    cycle_current: number,
    tag_name: string,
    tag_color: string,
    tag_id: string,
    img: string,
    user_imgs: string[],
  }

  const convertTime = (time: Date) => {
    return time.toLocaleString('ja');
  };

  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [modalRoom, setModalRoom] = useState<RoomType>({} as RoomType);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = ["Study", "Work", "Programming", "Writing"];

  const handleTagClick = (tag: string) => {
    if(tag === selectedTag) setSelectedTag(null);
    else setSelectedTag(tag);
  };

  const url = 'http://localhost:8000/api/';

  const handleSearch = async () => {
    const res = await axios.post(url+'search_rooms', {param: searchQuery, tag: selectedTag}, {withCredentials: true});
  }

  const fetchRooms = async () => {
    const res = await axios.get(url+'rooms', {withCredentials: true});
    // console.log(res.data);
    setRooms(res.data.data as RoomType[]);
  }

  useEffect(() => {
    fetchRooms()

  }, []);

  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
    // setSelectedValue(value);
  };

  const handleClick = (e) => {
    setOpen(true);
  }

  return (
    <>
      <div className={findRoom.header}>
        <div className={findRoom.search}>
          <TextField
            variant="outlined"
            placeholder="タイトル名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={findRoom.searchQuery}
            size="small"
            sx={{
              fieldset: {
                border: "none",
              },
            }}
          />
          <ul className={findRoom.tagList}>
            {tags.map((tag) => (
              <li className={findRoom.tagListItem} key={tag}>
                <Button
                  onClick={() => handleTagClick(tag)}
                  variant="contained"
                  className={findRoom.tagListItemButton}
                  sx={{
                    backgroundColor: selectedTag === tag ? "black" : "white",
                    "&:hover": {
                      backgroundColor:
                        selectedTag === tag ? "#101010" : "#f0f0f0",
                    },
                    color: selectedTag === tag ? "#fff" : "black",
                  }}
                >
                  {tag}
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <Button className={findRoom.submit} variant="contained">
          <Search />
        </Button>
      </div>
      <div className={style.main}>
        <h1 className={style.title}>部屋を探す</h1>
        <h2 className={findRoom.subtitle}>Active rooms</h2>
        <ul className={findRoom.roomList}>
          {rooms.map((room) => (
            <li className={findRoom.roomListItem} key={room.room_id}>
              <button
                type="button"
                // width='100%'
                className={findRoom.roomListLink}
              >
                <div className={findRoom.roomListItemImg}>
                  <img src={room.img == null ? '/sample_room.JPG' : room.img} alt="" />
                </div>
                <div className={findRoom.roomListItemContent}>
                  <h1 className={findRoom.roomListItemContentTitle}>
                    {room.title}
                  </h1>
                  <p className={findRoom.roomListItemContentTag}>{room.tag_name}</p>
                  <p className={findRoom.roomListItemContentNormal}>
                    {convertTime(room.start_at)}開始
                  </p>
                  <div className={findRoom.roomListItemContentFlex}>
                    <div>
                      <div className={findRoom.roomListItemContentFlex}>
                        <p className={findRoom.roomListItemContentBold}>
                          {room.cycle_current}/{room.cycle_num}
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
        <Button
          variant='contained'
          className={findRoom.createButton}
          onClick={handleClick}
        >
          <Add />
        </Button>
      </div>
      <CreateRoom open={open} onClose={onClose} />
    </>
  );
}

export default FindRoom
