# backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY backend/requirements.txt .

RUN apt update && apt upgrade -y
RUN apt install -y gcc libmariadb-dev libopencv-dev


RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
EXPOSE 8000
