from string import ascii_letters as alu # ascii_lowercase + ascii_uppercase
from string import ascii_lowercase as al # abcdefghijklmnopqrstuvwxyz
from string import ascii_uppercase as au # ABCDEFGHIJKLMNOPQRSTUVWXYZ
from string import digits # '0123456789'
from string import hexdigits # '0123456789abcdefABCDEF'
from string import octdigits # '01234567'
from string import punctuation # !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~.
from datetime import datetime as dt

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from handler import ProgressInfo, ReactionInfo, RoomInfo, TagInfo, RoomTag
from ulid import ULID


# データベースエンジンの作成
engine = create_engine('mysql://pomodoro:pomodoro@localhost:3306/pomodoro')
SessionClass = sessionmaker(engine)
session = SessionClass()

progress1 = ProgressInfo(progress_id='a', user_id='01JB5YQ3BG3G1W5QCMJ2Y9FHK1', start=dt.now(), progress_eval=9, progress_comment='ジョルダン標準形、理解できました！', room_id='01JB5ZC8EC5ZDA5TNMZXDR2TV2')
progress2 = ProgressInfo(progress_id='b', user_id='01JB5YQ3BG3G1W5QCMJ2Y9FHK1', start=dt.now(), progress_eval=1, progress_comment='ジョルダン標準形、なんもわからん', room_id='01JB5ZC8EC5ZDA5TNMZXDR2TV2')
progress3 = ProgressInfo(progress_id='c', user_id='01JB5YQ3BG3G1W5QCMJ2Y9FHK1', start=dt.now(), progress_eval=9, progress_comment='ばなな', room_id='01JB5ZC8EC5ZDA5TNMZXDR2TV2')

session.add_all([progress1, progress2, progress3])
session.commit()

reactions = [ReactionInfo(user_id='01JB5YQ3BG3G1W5QCMJ2Y9FHK1', progress_id=al[i]) for i in range(3)]
session.add_all(reactions)
session.commit()
