import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import './Header.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Header = forwardRef(({ username, handleLogout }, ref) => {
    const [remaining, setRemaining] = useState('--');
    const [total, setTotal] = useState('--');
    const [arknights, setArknights] = useState('--');

    const fetchUserStats = () => {
        console.log('[Header] 拉取用户票数中...');
        if (!username) return;

        fetch(`${backendUrl}/api/user_stats`, {
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('获取失败');
                return res.json();
            })
            .then(data => {
                console.log('[Header] 拉取成功: ', data);
                setRemaining(data.remaining_tickets);
                setTotal(data.total_votes);
                setArknights(data.arknights_votes);
            })
            .catch(err => {
                console.error('票数接口出错:', err);
            });
    };

    useEffect(() => {
        fetchUserStats();
    }, [username]);

    useImperativeHandle(ref, () => ({
        refreshStats: fetchUserStats
    }));

    return (
        <div className="header-container">
            {username ? (
                <div className="user-menu">
                    <div className="user-title">您好！ {username}</div>
                    <div className="dropdown">
                        <div>剩余票数: {remaining}</div>
                        <div>总投票数: {total}</div>
                        <div className="indent">明日方舟: {arknights}</div>
                        <button className="logout-btn" onClick={handleLogout}>退出登录</button>
                    </div>
                </div>
            ) : (
                <a href="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>登录 | 注册</a>
            )}
        </div>
    );
});

export default Header;
