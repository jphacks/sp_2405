from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from handler import RoomInfo, TagInfo, RoomTag

# データベースエンジンの作成
engine = create_engine('mysql://pomodoro:pomodoro@localhost:3306/pomodoro')
SessionClass = sessionmaker(engine)
session = SessionClass()

# 仮のデータを作成
def create_sample_data():
    # 部屋情報の作成
    room1 = RoomInfo(room_id='room1', title='Room 1', description='Description 1', start_at='2023-06-01 10:00:00', cycle_num=4, cycle_current=5, is_active=True)
    room2 = RoomInfo(room_id='room2', title='Room 2', description='Description 2', start_at='2023-06-02 14:00:00', cycle_num=3, cycle_current=3, is_active=True)
    room3 = RoomInfo(room_id='room3', title='Room 3', description='Description 3', start_at='2023-06-03 18:00:00', cycle_num=5, cycle_current=4, is_active=False)
    session.add_all([room1, room2, room3])
    session.commit()

    # タグ情報の作成
    # tag1 = TagInfo(tag_id='tag1', name='Tag 1')
    # tag2 = TagInfo(tag_id='tag2', name='Tag 2')
    # tag3 = TagInfo(tag_id='tag3', name='Tag 3')
    # session.add_all([tag1, tag2, tag3])
    # session.commit()

    # 部屋とタグの関連付け
    room_tag1 = RoomTag(room_id='room1', tag_id='tag1')
    # room_tag2 = RoomTag(room_id='room1', tag_id='tag2')
    room_tag3 = RoomTag(room_id='room2', tag_id='tag2')
    room_tag4 = RoomTag(room_id='room3', tag_id='tag3')
    session.add_all([room_tag1, room_tag3, room_tag4])

    session.commit()

# サンプルデータの作成
create_sample_data()
