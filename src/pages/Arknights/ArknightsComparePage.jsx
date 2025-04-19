import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../static/css/ArknightsComparePage.css';
import { DICT_NAME, DICT_PIC_URL, fallbackImages } from '../../../static/config/ArknightsConfig';

function ArknightsComparePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [currentPair, setCurrentPair] = useState([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [personalVotes, setPersonalVotes] = useState({});
  const [voteCount, setVoteCount] = useState(0);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const charactersMap = Object.keys(DICT_NAME).reduce((acc, name) => {
    acc[name] = {
      id: DICT_NAME[name],
      image: DICT_PIC_URL[name] || fallbackImages.default
    };
    return acc;
  }, {});

  const getVoteItems = async () => {
    return Object.keys(charactersMap).map(name => ({
      id: charactersMap[name].id,
      name,
      image: charactersMap[name].image
    }));
  };

  const castCompareVote = async (winnerId, loserId) => {
    const raw = localStorage.getItem('arknights_votes');
    const votes = raw ? JSON.parse(raw) : {};
    votes[winnerId] = (votes[winnerId] || 0) + 1;
    votes[loserId] = (votes[loserId] || 0) - 1;
    localStorage.setItem('arknights_votes', JSON.stringify(votes));
  };

  const getCompareResults = async () => {
    const raw = localStorage.getItem('arknights_votes');
    const votes = raw ? JSON.parse(raw) : {};
    const allItems = await getVoteItems();
    const operators = allItems.map(op => ({
      ...op,
      score: votes[op.id] || 0,
      voteCount: Math.abs(votes[op.id] || 0)
    })).sort((a, b) => b.score - a.score);
    const totalVotes = Object.values(votes).reduce((sum, v) => sum + Math.abs(v), 0);
    return { operators, totalVotes, isPersonal: false };
  };

  const handleImageError = (event) => {
    event.target.src = fallbackImages.default;
  };

  const handleBackToArknights = () => {
    navigate('/arknights');
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const itemsData = await getVoteItems();
        setItems(itemsData);
        getRandomPair(itemsData);
        setError(null);
      } catch (err) {
        console.error("初始化数据失败:", err);
        setError("加载数据时出错，请刷新页面重试。");
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);

  const getRandomPair = (operators = items) => {
    if (operators.length < 2) return;
    const index1 = Math.floor(Math.random() * operators.length);
    let index2;
    do {
      index2 = Math.floor(Math.random() * operators.length);
    } while (index2 === index1);
    setCurrentPair([operators[index1], operators[index2]]);
  };

  const handleVote = async (winnerId, loserId) => {
    try {
      setLoading(true);
      const updatedVotes = { ...personalVotes };
      updatedVotes[winnerId] = (updatedVotes[winnerId] || 0) + 1;
      updatedVotes[loserId] = (updatedVotes[loserId] || 0) - 1;
      setPersonalVotes(updatedVotes);
      setVoteCount(prev => prev + 1);
      await castCompareVote(winnerId, loserId);
      setSuccessMessage("投票成功！");
      setTimeout(() => setSuccessMessage(null), 1500);
      getRandomPair();
      setError(null);
    } catch (err) {
      console.error("投票失败:", err);
      setError(err.message || "投票失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    getRandomPair();
  };

  const handleViewResults = async () => {
    try {
      setLoading(true);
      const resultsData = await getCompareResults();
      setResults(resultsData);
      setShowResults(true);
    } catch (err) {
      console.error("获取结果失败:", err);
      setError("获取投票结果失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPersonalResults = () => {
    const personalResults = items.map(item => ({
      ...item,
      score: personalVotes[item.id] || 0,
      voteCount: Math.abs(personalVotes[item.id] || 0)
    })).sort((a, b) => b.score - a.score);
    setResults({ operators: personalResults, totalVotes: voteCount, isPersonal: true });
    setShowResults(true);
  };

  const handleBackToVote = () => {
    setShowResults(false);
  };

  const renderResults = () => {
    if (!results || !results.operators) return null;
    const { operators, totalVotes, isPersonal } = results;
    return (
      <div className="compare-results">
        <div className="back-button fixed-back" onClick={handleBackToVote}>← 返回投票</div>
        <h2>{isPersonal ? "您的投票结果" : "总投票结果"}</h2>
        <p className="vote-count-info">总投票数: {totalVotes}</p>
        <div className="operators-ranking">
          {operators.map((operator, index) => {
            const winRate = operator.voteCount > 0
              ? (((operator.score + operator.voteCount) / (2 * operator.voteCount)) * 100).toFixed(1)
              : 0;
            return (
              <div key={operator.id} className="rank-item">
                <div className="rank-number">{index + 1}</div>
                <div className="operator-image">
                  <img src={operator.image} alt={operator.name} onError={handleImageError} />
                </div>
                <div className="operator-info">
                  <h3>{operator.name}</h3>
                  <div className="stats">
                    <span className="score">得分: {operator.score}</span>
                    <span className="win-rate">胜率: {winRate}%</span>
                    <span className="vote-count">参与比较次数: {operator.voteCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderVoting = () => {
    if (currentPair.length !== 2) return null;
    const [operator1, operator2] = currentPair;
    return (
      <div className="compare-voting">
        {!showResults && (
          <div className="back-button fixed-back" onClick={handleBackToArknights}>← 返回明日方舟</div>
        )}
        <h2>请选择您认为更强的干员</h2>
        <p className="vote-count-info">您已投票: {voteCount} 次</p>
        <div className="operator-comparison">
          <div className="operator-card" onClick={() => handleVote(operator1.id, operator2.id)}>
            <div className="operator-image">
              <img src={operator1.image} alt={operator1.name} onError={handleImageError} />
            </div>
            <div className="operator-name">{operator1.name}</div>
          </div>
          <div className="vs-badge">VS</div>
          <div className="operator-card" onClick={() => handleVote(operator2.id, operator1.id)}>
            <div className="operator-image">
              <img src={operator2.image} alt={operator2.name} onError={handleImageError} />
            </div>
            <div className="operator-name">{operator2.name}</div>
          </div>
        </div>
        <div className="action-buttons">
          <button className="skip-button" onClick={handleSkip}>跳过</button>
          <button className="results-button" onClick={handleViewResults}>查看总排名</button>
          <button className="personal-results-button" onClick={handleViewPersonalResults}>我的投票</button>
        </div>
      </div>
    );
  };

  return (
    <div className="compare-container">
      <div className="header">
        <h1>干员强度对比投票</h1>
      </div>
      {loading && <div className="loading-overlay"><div className="loading-spinner"></div><div className="loading-text">加载中...</div></div>}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div className="content">
        {showResults ? renderResults() : renderVoting()}
      </div>
    </div>
  );
}

export default ArknightsComparePage;