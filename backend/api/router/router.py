from fastapi import APIRouter
from fastapi.responses import JSONResponse

from api.router.auth_router import auth_router

router = APIRouter(prefix='/api')
router.include_router(auth_router)

@router.post(path="/users")
async def create_user(user_name: str):
    return JSONResponse(content={'detail': f'Hello {user_name}!'}, status_code=200)

# @router.get(path="/users")
