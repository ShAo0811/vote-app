import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../static/css/ArknightsPage.css';
import ArknightsLogo from '../../../../components/Arknights/ArknightsLogo.jsx';

const ArknightsPage = () => {
  const navigate = useNavigate();
  const [glowEffect, setGlowEffect] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const handleButtonClick = () => {
    setGlowEffect(true);
    setFadeOut(true);
    setTimeout(() => navigate('/arknights/compare'), 500);
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
        投票选出你心目中的最强干员！系统将随机呈现两位干员，请选择你认为更强的一位。
      </p>
      <div className="buttons-container">
        <button 
          className={`glow-button ${glowEffect ? 'glow-active' : ''}`} 
          onClick={handleButtonClick}
        >
          <div className="button-glow"></div>
          <span className="button-text">开始投票</span>
        </button>
      </div>
    </div>
  );
};

export default ArknightsPage; 