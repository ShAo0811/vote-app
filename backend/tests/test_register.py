import requests

response = requests.post('http://localhost:9876/main/register', json={
    'username': 'testuser',
    'password': '123456'
})

print('状态码:', response.status_code)
print('响应内容:', response.text)
