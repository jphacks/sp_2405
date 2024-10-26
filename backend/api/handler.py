import re

from sqlalchemy import Boolean, create_engine, Column, String, DateTime, Integer, ForeignKey, select
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

# ベースクラスの作成
Base = declarative_base()

# ユーザー情報(userdata)テーブルの定義
class UserData(Base):
    __tablename__ = 'userdata'
    email = Column(String(128), nullable=False, unique=True)
    username = Column(String(64), nullable=False, unique=True)
    user_id = Column(String(26), nullable=False, primary_key=True)
    password = Column(String(64), nullable=False)
    room_id = Column(String(26), ForeignKey('room_info.room_id', ondelete='SET NULL'), unique=True)

# ログインセッション管理用トークンテーブル(tokens)
class Tokens(Base):
    __tablename__ = 'tokens'
    user_id = Column(String(26), ForeignKey('userdata.user_id', ondelete='CASCADE'), primary_key=True)
    session_token = Column(String(26), nullable=False, unique=True)

# 進捗報告(progress_info)テーブルの定義
class ProgressInfo(Base):
    __tablename__ = 'progress_info'
    progress_id = Column(String(26), primary_key=True)
    user_id = Column(String(26), ForeignKey('userdata.user_id', ondelete='CASCADE'), nullable=False)
    start = Column(DateTime, nullable=False)
    progress_eval = Column(Integer)
    progress_comment = Column(String(256))

# リアクション情報(reaction_info)テーブルの定義
class ReactionInfo(Base):
    __tablename__ = 'reaction_info'
    user_id = Column(String(26), ForeignKey('userdata.user_id', ondelete='CASCADE'), nullable=False ,primary_key=True)
    progress_id = Column(String(26), ForeignKey('progress_info.progress_id', ondelete='CASCADE'), nullable=False, primary_key=True)

# 部屋情報(room_info)テーブルの定義
class RoomInfo(Base):
    __tablename__ = 'room_info'
    room_id = Column(String(26), primary_key=True)
    title = Column(String(64), nullable=False)
    description = Column(String(64), nullable=False)
    start_at = Column(DateTime, nullable=False)
    cycle_num = Column(Integer, nullable=False)
    is_active = Column(Boolean, nullable=False)
    tags = relationship('TagInfo', secondary='room_tag', back_populates='rooms')

# タグ情報(tag_info)テーブルの定義
class TagInfo(Base):
    __tablename__ = 'tag_info'
    tag_id = Column(String(26), primary_key=True)
    name = Column(String(64), nullable=False, unique=True)
    rooms = relationship('RoomInfo', secondary='room_tag', back_populates='tags')

# 部屋-タグ中間テーブル(room_tag)の定義
class RoomTag(Base):
    __tablename__ = 'room_tag'
    room_id = Column(String(26), ForeignKey('room_info.room_id', ondelete='CASCADE'), primary_key=True)
    tag_id = Column(String(26), ForeignKey('tag_info.tag_id', ondelete='CASCADE'), primary_key=True)

# データベースエンジンの作成
engine = create_engine('mysql://pomodoro:pomodoro@localhost:3306/pomodoro')

def create():
    # テーブルの作成
    Base.metadata.create_all(engine)

SessionClass = sessionmaker(engine)
session = SessionClass()

def set_token(user_id: str, token: str) -> None:
    user = session.query(UserData).filter(UserData.user_id == user_id).one()
    if user:
        session.add(Tokens(user_id=user_id, session_token=token))
        session.commit()

def get_token(user_id: str) -> str:
    token = session.query(Tokens.session_token).filter(Tokens.user_id == user_id).scalar()
    print(token)

    return token

def verify(query: str, password: str) -> bool:
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
            'username': user.username,
            'email': user.email,
        }

        return data
