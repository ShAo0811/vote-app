from flask import Blueprint, request, jsonify, session
from backend.db import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash

main_bp = Blueprint('main', __name__, url_prefix='/api')

# 用户信息接口（登录后调用）
@main_bp.route('/user_stats')
def user_stats():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': '未登录'}), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT username FROM users WHERE id = %s", (user_id,))
    user_row = cursor.fetchone()

    cursor.execute("SELECT remaining_tickets, personal_votes FROM arknights_user_data WHERE user_id = %s", (user_id,))
    arknights_data = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify({
        'username': user_row['username'] if user_row else '',
        'remaining_tickets': arknights_data['remaining_tickets'] if arknights_data else 0,
        'total_votes': arknights_data['personal_votes'] if arknights_data else 0,
        'arknights_votes': arknights_data['personal_votes'] if arknights_data else 0
    })

# 注册接口
@main_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': '用户名和密码不能为空'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
    existing_user = cursor.fetchone()
    if existing_user:
        cursor.close()
        conn.close()
        return jsonify({'error': '用户名已存在'}), 400

    password_hash = generate_password_hash(password)
    cursor.execute('INSERT INTO users (username, password_hash) VALUES (%s, %s)', (username, password_hash))
    user_id = cursor.lastrowid

    cursor.execute('INSERT INTO arknights_user_data (user_id, remaining_tickets, personal_votes, last_ticket_refresh_date) VALUES (%s, %s, %s, CURDATE())', (user_id, 50, 0))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': '注册成功'}), 201

# 登录接口
@main_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute('SELECT id, password_hash FROM users WHERE username = %s', (username,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'error': '用户名或密码错误'}), 401

    session['user_id'] = user['id']

    return jsonify({'message': '登录成功'}), 200

# 登出接口
@main_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': '已登出'})
