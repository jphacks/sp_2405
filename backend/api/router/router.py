from fastapi import APIRouter, Request, Response, status
from fastapi.responses import JSONResponse

from api.router.auth_router import auth_router
import api.handler as handler
from api.schemas.schema import RoomConditions, CreateRoomCred
from api.router.ws_router import ws_router

router = APIRouter(prefix='/api')
router.include_router(auth_router)
router.include_router(ws_router)

@router.post(path="/users")
async def create_user(user_name: str):
    return JSONResponse(content={'detail': f'Hello {user_name}!'}, status_code=200)

@router.get(path="/rooms")
async def get_all_rooms():
    data = handler.get_all_rooms()
    return JSONResponse(content=data, status_code=200)
# @router.get(path="/users")

@router.get("/search_rooms")
def search_rooms(data: RoomConditions):
    rooms = handler.search_rooms(data.param, data.tag)
    print(rooms)
    return {"data": rooms}

@router.post(path="/create_room")
async def create_room(res: Response, data: CreateRoomCred):
    if data.title == '':
        return JSONResponse(content={'detail': 'Title is required'}, status_code=400)
    # if data.description == '':
    #     return JSONResponse(content={'detail': 'Description is required'}, status_code=400)
    if data.start_at == '':
        return JSONResponse(content={'detail': 'Start time is required'}, status_code=400)
    if data.cycle_num == '':
        return JSONResponse(content={'detail': 'Cycle number is required'}, status_code=400)

    room_id = handler.create_room(data.title, data.description, data.start_at, data.cycle_num, data.tag)
    res.set_cookie('ROOM_ID', room_id)

    return JSONResponse(content="Creation of Room Successful", status_code=status.HTTP_200_OK)

@router.get(path="/get_user")
async def get_user(user_id: str):
    return JSONResponse(
        content={'data': handler.user_data},
        status_code=200
    )

@router.get(path="/get_room")
async def get_room(req: Request):
    room_id = req.cookies.get('ROOM_ID', '')
    print(room_id)
    data = handler.get_room(room_id)
    if not data:
        return JSONResponse({'detail': 'room is not found'}, status_code=status.HTTP_404_NOT_FOUND)

    return JSONResponse(data, status_code=status.HTTP_200_OK)
