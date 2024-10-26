import json
from requests import get

data = {
  'param': 'Room 1',
  'tag': '',
}

res = get('http://localhost:8000/api/search_rooms', data=json.dumps(data))
print(res.json())
