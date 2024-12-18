from collections import defaultdict
from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from api.router.router import router
import api.handler as handler
from api.schemas.schema import SaveProgress

handler.create()
app = FastAPI()

origins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'ws://localhost:5173', '*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(router)

@app.middleware('http')
async def verify_token(req: Request, call_next):
    if req.url.path in ['/docs', '/api/auth/login', '/openapi.json']:
        return await call_next(req)

    response = await call_next(req)
    return response

    #一旦無視

    token = req.cookies.get('CLIENT_TOKEN', '')
    if not token or token not in valid_tokens:
        return JSONResponse(content={'detail': 'invalid cookie'}, status_code=status.HTTP_401_UNAUTHORIZED)

    response = await call_next(req)
    return response

@app.exception_handler(RequestValidationError)
async def exception_handler(request:Request, exc:RequestValidationError):
    print(exc)
    return JSONResponse(content={}, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
