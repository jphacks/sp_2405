from pydantic import BaseModel
from datetime import datetime

class LoginCred(BaseModel):
  username: str
  password: str

class RoomConditions(BaseModel):
  param: str
  tag: str
class RegisterCred(BaseModel):
  username: str
  email: str
  password: str

class CreateRoomCred(BaseModel):
  title: str
  description: str
  start_at: datetime
  cycle_num: int

class SaveProgress(BaseModel):
  user_id: str
  start: datetime
  progress_eval: int
  progress_comment: str
  room_id: str
