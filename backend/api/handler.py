from datetime import datetime
from pathlib import Path
import base64
import re
import hashlib

from sqlalchemy import Boolean, create_engine, Column, String, DateTime, Integer, ForeignKey, select, or_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker, joinedload, selectinload
from marshmallow import Schema, fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested
from ulid import ULID
import cv2


PUBLIC_PATH = Path(__file__).resolve().parent / 'public'
# ベースクラスの作成
Base = declarative_base()

# ユーザー情報(userdata)テーブルの定義
class UserData(Base):
    __tablename__ = 'userdata'
    email = Column(String(128), nullable=False, unique=True)
    username = Column(String(64), nullable=False, unique=True)
    user_id = Column(String(26), nullable=False, primary_key=True)
    password = Column(String(64), nullable=False)
    room_id = Column(String(26), ForeignKey('room_info.room_id', ondelete='SET NULL'))

# ログインセッション管理用トークンテーブル(tokens)
class Tokens(Base):
    __tablename__ = 'tokens'
    user_id = Column(String(26), ForeignKey('userdata.user_id', ondelete='CASCADE'))
    session_token = Column(String(26), nullable=False, primary_key=True)

# 進捗報告(progress_info)テーブルの定義
class ProgressInfo(Base):
    __tablename__ = 'progress_info'
    progress_id = Column(String(26), primary_key=True)
    user_id = Column(String(26), ForeignKey('userdata.user_id', ondelete='CASCADE'), nullable=False)
    start = Column(DateTime, nullable=False)
    progress_eval = Column(Integer)
    progress_comment = Column(String(256))
    room_id = Column(String(26), ForeignKey('room_info.room_id', ondelete='CASCADE'), nullable=False)
    reaction = relationship('ReactionInfo', back_populates='progress')

# リアクション情報(reaction_info)テーブルの定義
class ReactionInfo(Base):
    __tablename__ = 'reaction_info'
    user_id = Column(String(26), ForeignKey('userdata.user_id', ondelete='CASCADE'), nullable=False, primary_key=True)
    progress_id = Column(String(26), ForeignKey('progress_info.progress_id', ondelete='CASCADE'), nullable=False, primary_key=True)
    progress = relationship('ProgressInfo')


# ReactionInfoスキーマ
class ReactionInfoSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ReactionInfo
        load_instance = True
        include_fk = True  # 外部キーを含める

# ProgressInfoスキーマ
class ProgressInfoSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ProgressInfo
        load_instance = True
        include_fk = True  # 外部キーを含める

class ProgressReactionInfoSchema(SQLAlchemyAutoSchema):
    reaction = Nested(ReactionInfoSchema, many=True)  # 多対1のリレーションを設定

    class Meta:
        model = ProgressInfo
        load_instance = True
        include_fk = True  # 外部キーを含める

# 部屋情報(room_info)テーブルの定義
class RoomInfo(Base):
    __tablename__ = 'room_info'
    room_id = Column(String(26), primary_key=True)
    title = Column(String(64), nullable=False)
    description = Column(String(64), nullable=False)
    start_at = Column(DateTime, nullable=False)
    cycle_num = Column(Integer, nullable=False)
    cycle_current = Column(Integer, nullable=False)
    is_active = Column(Boolean, nullable=False)
    image_path = Column(String(128))
    tag_id = Column(String(26), ForeignKey('tag_info.tag_id', ondelete='SET NULL'))
    # tags = relationship('TagInfo', secondary='room_tag', back_populates='rooms')
    tag = relationship('TagInfo')

# タグ情報(tag_info)テーブルの定義
class TagInfo(Base):
    __tablename__ = 'tag_info'
    tag_id = Column(String(26), primary_key=True)
    name = Column(String(64), nullable=False, unique=True)
    color = Column(String(7), nullable=False, unique=True)
    rooms = relationship('RoomInfo', back_populates='tag')
    # rooms = relationship('RoomInfo', secondary='room_tag', back_populates='tags')

class RoomInfoSchema(SQLAlchemyAutoSchema):
    tag_id = fields.String()
    tag_name = fields.String(attribute="tag.name")
    tag_color = fields.String(attribute="tag.color")

    class Meta:
        model = RoomInfo
        include_fk = True
        load_instance = True

# 部屋-タグ中間テーブル(room_tag)の定義
class RoomTag(Base):
    __tablename__ = 'room_tag'
    room_id = Column(String(26), ForeignKey('room_info.room_id', ondelete='CASCADE'), primary_key=True)
    tag_id = Column(String(26), ForeignKey('tag_info.tag_id', ondelete='CASCADE'), primary_key=True)

# データベースエンジンの作成
engine = create_engine('mysql://pomodoro:pomodoro@db:3306/pomodoro')

def create():
    # テーブルの作成
    Base.metadata.create_all(engine)
    study = TagInfo(tag_id='tag1', name='Study', color='#F24822')
    work = TagInfo(tag_id='tag2', name='Work', color='#52f00e')
    programming = TagInfo(tag_id='tag3', name='Programming', color='#FFA629')
    workout = TagInfo(tag_id='tag4', name='Workout', color='#FACC00')


    for data in [study, work, programming, workout]:
        if not session.query(TagInfo).filter(TagInfo.tag_id == data.tag_id).first():
            session.add(data)
            session.commit()

SessionClass = sessionmaker(engine)
session = SessionClass()

def set_token(user_id: str, token: str) -> None:
    user = session.query(UserData).filter(UserData.user_id == user_id).one()
    if user:
        session.add(Tokens(user_id=user_id, session_token=token))
        session.commit()
        # print('aaa')

def get_token(user_id: str) -> str:
    token = session.query(Tokens.session_token).filter(Tokens.user_id == user_id).scalar()
    # print(token)

    return token

# ユーザー名が重複していないか確認
def verify_register(username: str, email: str) -> (bool, list[str]):
    same_name_user = session.query(UserData).filter(UserData.username == username).all()
    same_email_user = session.query(UserData).filter(UserData.email == email).all()
    error = []
    if len(same_name_user) > 0:
        error.append('An account with the user name already exists')
    if len(same_email_user) > 0:
        error.append('An account with the email address already exists')

    if len(error) > 0:
        return False, error
    else:
        return True , []

# ユーザー情報を新規登録
def register(username: str, email: str, password: str) -> bool:
    password = hashlib.sha256(password.encode()).hexdigest()
    user_id = str(ULID())
    user = UserData(
        username=username,
        email=email,
        password=password,
        user_id=user_id
    )
    session.add(user)
    session.commit()
    return user_id

def verify_login(query: str, password: str) -> bool:
    if re.match(r'.+@.+\..+', query):
        user =  session.query(UserData).filter(UserData.email == query, UserData.password == password).one()
    else:
        user =  session.query(UserData).filter(UserData.username == query, UserData.password == password).one()

    if user:
        return user.user_id
    else:
        return ''

def get_user_from_token(token: str):
    user_id = session.query(Tokens.user_id).filter(Tokens.session_token == token).scalar()
    if user_id:
        user = session.query(UserData).filter(UserData.user_id == user_id).one()
        data = {
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
        }
        return data

def get_all_rooms():
    rooms = session.query(RoomInfo).filter(RoomInfo.is_active == True).options(joinedload(RoomInfo.tag)).all()
    data = RoomInfoSchema().dump(rooms, many=True)


    for i, datum in enumerate(data):
        if datum['image_path']:
            img = cv2.imread(PUBLIC_PATH / 'room_images' / datum['image_path'])
            _, encoded = cv2.imencode('.jpg', img)
            img_str = base64.b64decode(encoded).decode('ascii')
            data[i]['img'] = img_str
            del data[i]['image_path']
        else:
            data[i]['img'] = None
            del data[i]['image_path']

        data[i]['user_imgs'] = []
    return {'data': data}


def search_rooms(param: str = None, tag: str = None):
    query = session.query(RoomInfo).filter(RoomInfo.is_active == True)

    if param:
        query = query.filter(or_(
            RoomInfo.title.contains(param),
            RoomInfo.description.contains(param)
        ))

    if tag:
        query = query.join(RoomTag).join(TagInfo).filter(
            TagInfo.name == tag
        )

    rooms = query.all()

    # print(rooms)

    data = [
        {
            'room_id': room.room_id,
            'title': room.title,
            'description': room.description,
            'start_at': room.start_at,
            'cycle_num': room.cycle_num,
            'tags': [tag.name for tag in room.tags],
        }
        for room in rooms
    ]

    return data
def create_room(title: str, description: str, start_at: datetime, cycle_num: int, tag: str):
    if tag:
        tag_id = session.query(TagInfo.tag_id).filter(TagInfo.name == tag).scalar()
    else:
        tag_id = None

    assert isinstance(title, str) and isinstance(description, str) and isinstance(start_at, datetime) and isinstance(cycle_num, int) and isinstance(tag, str)

    room_id = str(ULID())
    room = RoomInfo(
        room_id=room_id,
        title=title,
        description=description,
        start_at=start_at.isoformat(),
        cycle_num=cycle_num,
        cycle_current=0,
        is_active=True,
        tag_id=tag_id
    )
    session.add(room)
    session.commit()

    return room_id

def get_user_info(user_id: str):
    user = session.query(UserData).filter(UserData.user_id == user_id).one()

    data = {
        'username': user.username,
        'user_image': None
    }
    return data

def save_progress(user_id: str, start: str, progress_eval: int, progress_comment: str, room_id: str):
    if session.query(UserData).filter(UserData.user_id == user_id).scalar() is None:
        return False, ['Designated user does not exist']
    # print(session.query(RoomInfo).filter(RoomInfo.room_id == room_id).scalar())
    if session.query(RoomInfo).filter(RoomInfo.room_id == room_id).scalar() is None:
        return False, ['Designated room does not exist']

    progress = ProgressInfo(
        progress_id=ULID(),
        user_id=user_id,
        start=start,
        progress_eval=progress_eval,
        progress_comment=progress_comment,
        room_id=room_id
    )
    session.add(progress)
    session.commit()
    return ProgressInfoSchema().dump(progress), []

def verify_room(room_id: str):
    room = session.query(RoomInfo).filter(RoomInfo.room_id == room_id).first()
    return bool(room)

def get_room(room_id: str):
    room = session.query(RoomInfo).filter(RoomInfo.room_id == room_id).options(joinedload(RoomInfo.tag)).first()
    data = RoomInfoSchema().dump(room)

    progress = session.query(ProgressInfo).filter(ProgressInfo.room_id == room_id).options(selectinload(ProgressInfo.reaction)).all()
    progress_info_schema = ProgressReactionInfoSchema(many=True)
    progress = progress_info_schema.dump(progress)
    # print(progress)

    for i, datum in enumerate(progress):
        user_ids = [d['user_id'] for d in datum['reaction']]
        progress[i]['reaction'] = user_ids

    # print(data)

    return {'room': data, 'progress': progress}
