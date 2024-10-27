from datetime import datetime as dt, timedelta as td, timezone as tz

from fastapi import APIRouter, Request, Response, status
from fastapi.responses import JSONResponse
from ulid import ULID

from api.handler import get_user_from_token, verify_login, set_token
import api.handler as handler
from api.schemas.schema import LoginCred, RegisterCred

auth_router = APIRouter(prefix='/auth')

@auth_router.post(path="/register")
async def register(res: Response, data: RegisterCred):
  is_valid, error = handler.verify_register(data.username, data.email)
  if not is_valid:
    return JSONResponse({'detail': error}, status_code=status.HTTP_400_BAD_REQUEST)

  user_id = handler.register(data.username, data.email, data.password)

  # token = str(ULID())
  # handler.set_token(user_id, token)
  # res.set_cookie('CLIENT_TOKEN', token, expires=dt.now()+td(days=2))
  return JSONResponse({'detail': 'Registration successful'}, status_code=status.HTTP_200_OK)

@auth_router.post(path="/login")
async def login(res: Response, data: LoginCred):
  query = data.username
  password = data.password
  user_id = verify_login(query, password)
  if user_id:
    token = ULID()
    resp = JSONResponse(content={'detail': 'successful'}, status_code=status.HTTP_200_OK)
    resp.set_cookie(key='CLIENT_TOKEN', value=str(token), expires=dt.now(tz(td(0), 'UTC'))+td(days=2), httponly=True, samesite='Lax', secure=False)
    # res.set_cookie('a', 'b')
    set_token(user_id, token)

    # print('aaa')

    # return JSONResponse(content={'detail': 'successful'}, status_code=status.HTTP_200_OK)
    return resp
  else:
    return JSONResponse({'detail': 'login failed'}, status_code=status.HTTP_401_UNAUTHORIZED)

@auth_router.get(path='/profile')
async def profile(req: Request):
  data = {
    'username': 'a',
    'email': 'a@example.com'
  }
  # return JSONResponse({'detail': 'aaa'}, status_code=status.HTTP_400_BAD_REQUEST)
  # return JSONResponse({'detail': data}, status_code=status.HTTP_200_OK)

  # print(req.cookies)
  print(req.cookies.get('CLIENT_TOKEN', ''))
  data = get_user_from_token(req.cookies.get('CLIENT_TOKEN', ''))
  print(data)
  if data:
    return JSONResponse({'detail': data}, status_code=status.HTTP_200_OK)
  else:
    return JSONResponse({'detail': 'user not found'}, status_code=status.HTTP_401_UNAUTHORIZED)
