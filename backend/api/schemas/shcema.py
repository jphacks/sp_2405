from pydantic import BaseModel


class LoginCred(BaseModel):
  username: str
  password: str

