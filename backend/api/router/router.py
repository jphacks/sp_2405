from fastapi import APIRouter
from fastapi.responses import JSONResponse

from api.router.auth_router import auth_router
import api.handler as handler
import api.handler  as search_rooms


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

@router.get("/api/search_rooms")
def search_rooms_endpoint(param: str = None, tags: List[str] = None, db: Session = Depends(get_db)):
    rooms = search_rooms(db, param, tags)
    return {"data": rooms}
