import re


s = 'a@example.com'
# s = 'alksdfj'
a = re.match(r'.+@.+\..+', s)
print(a)
