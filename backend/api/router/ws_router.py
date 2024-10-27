from collections import defaultdict

from fastapi import APIRouter, Request, Response, WebSocket, WebSocketDisconnect, status
from fastapi.responses import JSONResponse
from ulid import ULID
from sqlalchemy import event
import asyncio

import api.handler as handler
from api.schemas.schema import LoginCred, SaveProgress

ws_router = APIRouter(prefix='/ws')

class Room:
  def __init__(self):
    self.rooms = defaultdict(list)

  async def connect(self, websocket: WebSocket, room_id: str):
    await websocket.accept()
    self.rooms[room_id].append(websocket)

  async def disconnect(self, websocket: WebSocket, room_id: str):
    await websocket.close()
    self.rooms[room_id].remove(websocket)
    if not self.rooms[room_id]:
      del self.rooms[room_id]

  async def broadcast(self, data: dict, room_id: str):
    for user in self.rooms[room_id]:
      await user.send_json(data)

rooms = Room()

@ws_router.websocket(path='/room/{user_id}')
async def ws_room(ws: WebSocket, user_id: str):

  room_id = ws.cookies.get('ROOM_ID', '')

  room = handler.verify_room(room_id)
  if room is None:
    return

  rooms.connect(ws, room_id)

  try:
    while True:
      await ws.receive_text()
  except WebSocketDisconnect:
    rooms.disconnect(ws, room_id)
    print(f'Client {user_id} left the socket connection')


@ws_router.post(path="/save_progress")
async def save_progress(req: Request, data: SaveProgress):
  room_id = req.get('ROOM_ID', '')
  if not room_id:
    JSONResponse(content={'detail': 'room is not found'}, status_code=status.HTTP_404_NOT_FOUND)

  progress, error = handler.save_progress(data.user_id, data.start, data.progress_eval, data.progress_comment, data.room_id)
  if not progress:
    return JSONResponse(content={'detail': error}, status_code=status.HTTP_400_BAD_REQUEST)

  rooms.broadcast(progress, room_id)

  return JSONResponse(content={'detail': "Saving progress Successful"}, status_code=status.HTTP_200_OK)

class Home:
  def __init__(self):
    self.users = []

  async def connect(self, websocket: WebSocket):
    await websocket.accept()
    self.users.append(websocket)

  async def disconnect(self, websocket: WebSocket):
    await websocket.close()
    self.users.remove(websocket)

  async def broadcast(self, data: dict):
    for user in self.users:
      await user.send_json(data)

home = Home()

# # after_insertイベント
# @event.listens_for(handler.RoomInfo, "after_insert")
# def after_insert(mapper, connection, target):
#     asyncio.create_task(home.broadcast(f"[INSERT] New record added: {target.name}, Age: {target.age}"))

# # after_updateイベント
# @event.listens_for(handler.RoomInfo, "after_update")
# def after_update(mapper, connection, target):
#     asyncio.create_task(home.broadcast(f"[UPDATE] Record updated: {target.name}, Age: {target.age}"))

# # after_deleteイベント
# @event.listens_for(handler.RoomInfo, "after_delete")
# def after_delete(mapper, connection, target):
#     asyncio.create_task(home.broadcast(f"[DELETE] Record deleted: ID {target.id}"))

@ws_router.websocket('/home')
async def ws_home():
  ...
