from fastapi import APIRouter
from fastapi.responses import JSONResponse

from api.router.auth_router import auth_router
import api.handler as handler
from api.schemas.shcema import CreateRoomCred

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
