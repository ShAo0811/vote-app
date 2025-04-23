from flask import Flask
from arknights.routes import arknights_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.register_blueprint(arknights_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9876)
