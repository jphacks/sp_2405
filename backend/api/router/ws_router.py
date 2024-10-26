from fastapi import APIRouter, Request, Response, status
from fastapi.responses import JSONResponse
from ulid import ULID

from api.handler import get_user_from_token, verify, set_token
from api.schemas.schema import LoginCred

ws_router = APIRouter(prefix='/ws')
