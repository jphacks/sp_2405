from requests import get


res = get('http://localhost:8000/api/rooms')
print(res.json())
