import json
from flask import Blueprint, request, jsonify
import random
import pickle
import os
from .config import DICT_NAME, DICT_INDEX
arknights_bp = Blueprint('arknights', __name__, url_prefix='/arknights')

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data')
WIN_PATH = os.path.join(DATA_PATH, 'win_score.pickle')
LOSE_PATH = os.path.join(DATA_PATH, 'lose_score.pickle')
IP_PATH = os.path.join(DATA_PATH, 'ip_dict.pickle')

# 安全读取 pickle 文件
def load(path):
    if os.path.exists(path):
        try:
            with open(path, 'rb') as f:
                return pickle.load(f)
        except (EOFError, pickle.UnpicklingError, Exception) as e:
            print(f"⚠️ 读取失败 {path}: {e}")
            return {}
    return {}

# 保存分数
def save(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as f:
        pickle.dump(obj, f)


@arknights_bp.route('/new_compare')
def new_compare():
    a, b = random.sample(DICT_INDEX, 2)
    return jsonify([a, b])


# 保存投票分数
@arknights_bp.route('/save_score', methods=['POST'])
def save_score():
    try:
        data = request.get_json()
        win = data.get('win', '').strip()
        lose = data.get('lose', '').strip()

        if not win or not lose:
            return jsonify({'error': 'Invalid data'}), 400

        win_score = load(WIN_PATH)
        lose_score = load(LOSE_PATH)

        win_score[win] = win_score.get(win, 0) + 1
        lose_score[lose] = lose_score.get(lose, 0) + 1

        save(WIN_PATH, win_score)
        save(LOSE_PATH, lose_score)

        return jsonify({'status': 'success'})

    except Exception as e:
        print(f"❌ 保存失败: {e}")
        return jsonify({'error': str(e)}), 500


# 获取总排名
@arknights_bp.route('/view_final_order', methods=['GET'])
def view_final_order():
    win_score = load(WIN_PATH)
    lose_score = load(LOSE_PATH)

    all_names = set(win_score.keys()) | set(lose_score.keys())
    result = []
    for name in all_names:
        wins = win_score.get(name, 0)
        losses = lose_score.get(name, 0)
        total = wins + losses
        result.append({
            'name': name,
            'score': wins - losses,
            'voteCount': total
        })

    result.sort(key=lambda x: x['score'], reverse=True)
    return jsonify(result)

@arknights_bp.route('/config')
def get_config():
    config_path = os.path.join(os.path.dirname(__file__), 'config.json')
    with open(config_path, encoding='utf-8') as f:
        config_data = json.load(f)
    return jsonify(config_data)
