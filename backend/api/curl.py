from requests import get
import marshmallow


res = get('http://localhost:8000/api/rooms')
print(res.json())
