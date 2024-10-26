from pydantic import BaseModel


class LoginCred(BaseModel):
  username: str
  password: str

class RoomConditions(BaseModel):
  param: str
  tag: str
