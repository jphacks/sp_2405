from pydantic import BaseModel


class LoginCred(BaseModel):
  username: str
  password: str

class RegisterCred(BaseModel):
  username: str
  email: str
  password: str

