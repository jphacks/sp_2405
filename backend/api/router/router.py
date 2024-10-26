from fastapi import APIRouter
from fastapi.responses import JSONResponse

from api.router.auth_router import auth_router
import api.handler as handler
from api.schemas.schema import RoomConditions, CreateRoomCred, SaveProgressCred

router = APIRouter(prefix='/api')
router.include_router(auth_router)

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
async def create_room(data: CreateRoomCred):
    if data.title == '':
        return JSONResponse(content={'detail': 'Title is required'}, status_code=400)
    if data.description == '':
        return JSONResponse(content={'detail': 'Description is required'}, status_code=400)
    if data.start_at == '':
        return JSONResponse(content={'detail': 'Start time is required'}, status_code=400)
    if data.cycle_num == '':
        return JSONResponse(content={'detail': 'Cycle number is required'}, status_code=400)

    handler.create_room(data.title, data.description, data.start_at, data.cycle_num)
    return JSONResponse(content="Creation of Room Successful", status_code=200)

@router.get(path="/get_user")
async def get_user(user_id: str):
    return JSONResponse(
        content={'data': handler.user_data},
        status_code=200
    )

@router.post(path="/save_progress")
async def save_progress(data: SaveProgressCred):
    is_valid, error = handler.save_progress(data.user_id, data.start, data.progress_eval, data.progress_comment, data.room_id)
    if not is_valid:
        return JSONResponse(content={'detail': error}, status_code=400)

    return JSONResponse(content={'detail': "Saving progress Successful"}, status_code=200)
