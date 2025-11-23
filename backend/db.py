import mysql.connector

db_config = {
    'user': 'root',
    'password': 'hsw3262178',
    'database': 'vote_system',
    'unix_socket': '/tmp/mysql.sock'
}

def get_db_connection():
    return mysql.connector.connect(**db_config)
