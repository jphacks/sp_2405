from random import choice, randint
from string import ascii_letters as alu # ascii_lowercase + ascii_uppercase
from string import ascii_lowercase as al # abcdefghijklmnopqrstuvwxyz
from string import ascii_uppercase as au # ABCDEFGHIJKLMNOPQRSTUVWXYZ
from string import digits # '0123456789'
from string import hexdigits # '0123456789abcdefABCDEF'
from string import octdigits # '01234567'
from string import punctuation # !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~.
from datetime import datetime as dt
import hashlib

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from handler import ProgressInfo, ReactionInfo, RoomInfo, TagInfo, RoomTag, Base, UserData
from ulid import ULID


# データベースエンジンの作成
engine = create_engine('mysql://pomodoro:pomodoro@localhost:3306/pomodoro')
SessionClass = sessionmaker(engine)
session = SessionClass()

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)
study = TagInfo(tag_id='tag1', name='Study', color='#F24822')
work = TagInfo(tag_id='tag2', name='Work', color='#52f00e')
programming = TagInfo(tag_id='tag3', name='Programming', color='#FFA629')
workout = TagInfo(tag_id='tag4', name='Workout', color='#FACC00')

session.add_all([study, work, programming, workout])
session.commit()

n = 3
user_ids = [ULID() for _ in range(n)]
emails = [f'{al[i]}@example.com' for i in range(n)]
password = hashlib.sha256('aaaaaaaa'.encode()).hexdigest()
users = [UserData(email=emails[i], user_id=user_ids[i], password=password, username=al[i]) for i in range(n)]
session.add_all(users)
session.commit()

exit()

m = 3
room_ids = [ULID() for _ in range(m)]
titles = ['ジョルダン標準形を覚える会', '勉強会', '勉強会']
rooms = [RoomInfo(room_id=room_ids[i], title=titles[i], description='一緒に勉強頑張りましょう！', start_at=dt.now(), cycle_num=5, cycle_current=1, is_active=True, tag_id=f'tag{randint(1,4)}') for i in range(m)]
session.add_all(rooms)
session.commit()

l = 3
progress_ids = [ULID() for _ in range(l)]
progress = [ProgressInfo(progress_id=progress_ids[i], user_id=choice(user_ids), start=dt.now(), progress_eval=randint(0, 10), progress_comment='ジョルダン標準形、理解できました！', room_id=room_ids[0]) for i in range(l)]

session.add_all(progress)
session.commit()

reactions = [ReactionInfo(user_id=user_ids[i], progress_id=progress_ids[0]) for i in range(n)]
session.add_all(reactions)
session.commit()
