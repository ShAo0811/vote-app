import json
from flask import Blueprint, request, jsonify, session
import random
import pickle
import os
from .config import DICT_NAME, DICT_INDEX
from backend.db import get_db_connection
import datetime

arknights_bp = Blueprint('arknights', __name__, url_prefix='/arknights')

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data')
WIN_PATH = os.path.join(DATA_PATH, 'win_score.pickle')
LOSE_PATH = os.path.join(DATA_PATH, 'lose_score.pickle')

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

# 原功能接口 ↓↓↓ 不动

@arknights_bp.route('/new_compare')
def new_compare():
    a, b = random.sample(DICT_INDEX, 2)
    return jsonify([a, b])

@arknights_bp.route('/save_score', methods=['POST'])
def save_score():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': '未登录'}), 401

        data = request.get_json()
        win = data.get('win', '').strip()
        lose = data.get('lose', '').strip()

        if not win or not lose:
            return jsonify({'error': '数据无效'}), 400

        # 更新胜负分数（略）

        conn = get_db_connection()
        cursor = conn.cursor()

        # ✅ 限制票数必须大于 0 才能投票
        cursor.execute("""
            UPDATE arknights_user_data 
            SET remaining_tickets = remaining_tickets - 1, personal_votes = personal_votes + 1 
            WHERE user_id = %s AND remaining_tickets > 0
        """, (user_id,))
        conn.commit()

        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({'error': '票数不足，无法继续投票'}), 403

        # ✅ 重新获取票数
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT remaining_tickets FROM arknights_user_data WHERE user_id = %s', (user_id,))
        user_data = cursor.fetchone()

        cursor.close()
        conn.close()

        return jsonify({
            'status': 'success',
            'remaining_tickets': user_data['remaining_tickets'] if user_data else None
        })

    except Exception as e:
        print(f"❌ 保存失败: {e}")
        return jsonify({'error': str(e)}), 500

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

@arknights_bp.route('/reset_votes', methods=['POST'])
def reset_votes():
    if os.environ.get("FLASK_ENV") != "development":
        return jsonify({'error': 'Not allowed in production'}), 403
    try:
        for path in [WIN_PATH, LOSE_PATH]:
            with open(path, 'wb') as f:
                pickle.dump({}, f)
        print("🧹 投票数据已重置")
        return jsonify({'status': 'reset successful'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 新增：扣票、个人榜单解锁
@arknights_bp.route('/vote', methods=['POST'])
def vote():
    user_id = session.get('user_id') or request.get_json().get('user_id')  # 支持前后兼容

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute('SELECT remaining_tickets, personal_votes, last_ticket_refresh_date FROM arknights_user_data WHERE user_id = %s', (user_id,))
    user_data = cursor.fetchone()

    if not user_data:
        cursor.close()
        conn.close()
        return jsonify({'error': '用户数据未找到'}), 404

    today = datetime.date.today()

    # 每日刷新票数（如果需要）
    if user_data['last_ticket_refresh_date'] != today:
        cursor.execute('UPDATE arknights_user_data SET remaining_tickets = 50, last_ticket_refresh_date = %s WHERE user_id = %s', (today, user_id))
        conn.commit()
        user_data['remaining_tickets'] = 50

    # ✅ 如果票数已经为 0，直接拒绝
    if user_data['remaining_tickets'] <= 0:
        cursor.close()
        conn.close()
        return jsonify({'error': '今日票数已用尽'}), 403

    # ✅ 使用防护条件限制：只在票数大于 0 时更新
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE arknights_user_data
        SET remaining_tickets = remaining_tickets - 1,
            personal_votes = personal_votes + 1
        WHERE user_id = %s AND remaining_tickets > 0
    ''', (user_id,))
    conn.commit()

    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        return jsonify({'error': '扣票失败，可能票数已用尽'}), 403

    # ✅ 再次查询最新票数
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT remaining_tickets FROM arknights_user_data WHERE user_id = %s', (user_id,))
    latest = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify({'message': f'投票成功，剩余票数：{latest["remaining_tickets"]}'}), 200


@arknights_bp.route('/check_personal_unlock', methods=['GET'])
def check_personal_unlock():
    user_id = request.args.get('user_id')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute('SELECT personal_votes FROM arknights_user_data WHERE user_id = %s', (user_id,))
    user_data = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user_data:
        return jsonify({'error': '用户数据未找到'}), 404

    unlocked = user_data['personal_votes'] >= 30
    return jsonify({'unlocked': unlocked, 'personal_votes': user_data['personal_votes']}), 200
