import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/css/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  // 投票模块数据
  const voteModules = [
    {
      id: 'arknights',
      name: '明日方舟',
      description: '六星干员强度投票',
      path: '/arknights',
      color: '#ff9100'
    },
    {
      id: 'coming-soon-1',
      name: '即将上线',
      description: '敬请期待更多投票项目',
      path: '#',
      color: '#3498db'
    },
    {
      id: 'coming-soon-2',
      name: '即将上线',
      description: '敬请期待更多投票项目',
      path: '#',
      color: '#2ecc71'
    }
  ];

  const handleButtonClick = (path) => {
    if (path !== '#') {
      navigate(path);
    }
  };

  return (
    <div className="new-home-container">
      <header className="new-header">
        <h1>啥都能投</h1>
        <p>为你感兴趣的事物投票表达意见</p>
      </header>

      <main className="modules-container">
        {voteModules.map((module) => (
          <div 
            key={module.id}
            className={`vote-module ${module.path === '#' ? 'disabled' : ''}`}
            style={{ '--module-color': module.color }}
          >
            <div className="module-content">
              <div className="module-info">
                <h2>{module.name}</h2>
                <p>{module.description}</p>
              </div>
              <button 
                className="module-button"
                disabled={module.path === '#'}
                onClick={() => handleButtonClick(module.path)}
              >
                {module.path === '#' ? '敬请期待' : '进入'}
              </button>
            </div>
          </div>
        ))}
      </main>

      <footer className="new-footer">
        <p>&copy; {new Date().getFullYear()} 啥都能投 | 提供各类事物的投票平台</p>
      </footer>
    </div>
  );
};

export default HomePage; 