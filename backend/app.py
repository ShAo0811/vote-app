from flask import Flask
from backend.main.routes import main_bp
from backend.arknights.routes import arknights_bp
# 未来可添加 genshin.routes 等等
from backend.users.routes import users_bp
from flask_cors import CORS
from flask import Flask, session
from flask_cors import CORS
from flask_session import Session

app = Flask(__name__)
CORS(app, origins=["http://localhost:5174"], supports_credentials=True)
app.secret_key = 'your_secret_key'
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

app.register_blueprint(main_bp)
# 注册模块蓝图
app.register_blueprint(arknights_bp)
# app.register_blueprint(genshin_bp)
app.register_blueprint(users_bp, url_prefix='/users')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9876)