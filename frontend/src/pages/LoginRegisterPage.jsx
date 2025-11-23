import React, { useState } from 'react';

function LoginRegisterPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const BASE_URL = 'http://localhost:9876/api'; // 根据后端实际端口调整

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/register' : '/login';
    try {
      const res = await fetch(BASE_URL + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || '成功');
        if (data.message === '登录成功') {
          window.location.href = '/';  // ✅ 登录成功后刷新页面
        }
        
      } else {
        setMessage(data.error || '发生错误');
      }
    } catch (err) {
      setMessage('网络错误');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center', padding: '2rem', border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>{isRegister ? '注册' : '登录'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.7rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>
          {isRegister ? '注册' : '登录'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', cursor: 'pointer', color: '#1976d2' }} onClick={() => { setIsRegister(!isRegister); setMessage(''); }}>
        {isRegister ? '已有账号？点这里登录' : '没有账号？点这里注册'}
      </p>
      {message && <div style={{ marginTop: '1rem', color: message.includes('成功') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
}

export default LoginRegisterPage;
