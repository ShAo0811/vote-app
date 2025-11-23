import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../static/css/ArknightsPage.css';
import ArknightsLogo from '../../../../components/Arknights/ArknightsLogo';

const ArknightsPage = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const storedCount = parseInt(localStorage.getItem('voteCount') || '0');
    setVoteCount(storedCount);
  }, []);

  const handleStartVoteClick = () => {
    setExpanded(true);
    setFadeOut(true);
    setTimeout(() => navigate('/arknights/compare'), 1010);
};


  const handleBackToHome = () => {
    setFadeOut(true);
    setTimeout(() => navigate('/'), 500);
  };

  return (
    <div className={`home-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="back-button" onClick={handleBackToHome}>
        <span>&#8592; 返回首页</span>
      </div>

      <div className="logo-container">
        <ArknightsLogo />
      </div>
      <h1 className="title">明日方舟六星干员投票</h1>
      <p className="description">
        投票选出你心目中的最强干员！
      </p>

      <div className={`originiums-container ${expanded ? 'expand' : ''}`} onClick={handleStartVoteClick}>
        <div className="originiums-outer"></div>
        <div className="originiums-inner"></div>
        <div className="originiums-text">开始投票</div>
      </div>

      <div className="rules-box">
        <h3>规则说明（总榜）</h3>
        <ul>
          <li>每次投票将随机呈现两名干员，请选择更强的一位</li>
          <li>每名干员的总分由对战胜负累计计算（胜 +1，负 -1）</li>
          <li>总榜展示所有用户投票累计后的干员排名</li>
          <li>完成 30 次投票后可解锁专属个人排榜功能</li>
        </ul>
      </div>
    </div>
  );
};

export default ArknightsPage;
