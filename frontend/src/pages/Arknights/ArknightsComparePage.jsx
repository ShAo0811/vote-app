import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../static/css/ArknightsComparePage.css';

function ArknightsComparePage() {
  const [config, setConfig] = useState(null);
  const [pair, setPair] = useState([]);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [personalVotes, setPersonalVotes] = useState({});
  const [voteCount, setVoteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPair = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/arknights/new_compare`);
      const data = await res.json();
      setPair(data);
    } catch (err) {
      setError('获取干员失败');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (winner, loser) => {
    try {
      setLoading(true);
      const updatedVotes = { ...personalVotes };
      updatedVotes[winner] = (updatedVotes[winner] || 0) + 1;
      updatedVotes[loser] = (updatedVotes[loser] || 0) - 1;
      setPersonalVotes(updatedVotes);
      setVoteCount(prev => prev + 1);

      await fetch(`${import.meta.env.VITE_BACKEND_URL}/arknights/save_score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ win: winner, lose: loser })
      });
      setSuccessMessage("投票成功！");
      setTimeout(() => setSuccessMessage(null), 1500);
      fetchPair();
    } catch (err) {
      setError("投票失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };
  const handleViewResults = () => {
    navigate('/arknights/compare/result');
  };


  const handleViewPersonalResults = () => {
    if (!config) return;
    const operators = Object.keys(config.DICT_NAME).map(name => {
      const score = personalVotes[name] || 0;
      return {
        name,
        score,
        voteCount: Math.abs(score),
        image: config.DICT_PIC_URL[name]
      };
    }).sort((a, b) => b.score - a.score);
    setResults({ operators, isPersonal: true });
    setShowResults(true);
  };

  const handleBackToVote = () => setShowResults(false);

  useEffect(() => {
    const configURL = `${import.meta.env.VITE_BACKEND_URL}/arknights/config`;
    fetch(configURL)
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        fetchPair();
      })
      .catch(err => {
        setError("配置加载失败");
      });
  }, []);

  const renderResults = () => {
    if (!results || !results.operators) return null;
    return (
      <div className="compare-results">
        <button className="back-button" onClick={handleBackToVote}>← 返回投票</button>
        <h2>{results.isPersonal ? "您的投票结果" : "总投票结果"}</h2>
        <div className="operators-ranking">
          {results.operators.map((operator, index) => {
            const winRate = operator.voteCount > 0
              ? (((operator.score + operator.voteCount) / (2 * operator.voteCount)) * 100).toFixed(1)
              : 0;
            return (
              <div key={operator.name} className="rank-item">
                <div className="rank-number">#{index + 1}</div>
                <img src={operator.image} alt={operator.name} />
                <div className="operator-info">
                  <div className="operator-name">{operator.name}</div>
                  <div className="score">得分: {operator.score}</div>
                  <div className="win-rate">胜率: {winRate}%</div>
                  <div className="vote-count">比较次数: {operator.voteCount}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="compare-container">
      {/* ✅ 新增返回按钮 */}
      <div className="back-button fixed-back" onClick={() => navigate('/arknights')}>
        ← 返回明日方舟
      </div>

      <h1>干员强度对比投票</h1>
      {loading && <div className="loading">加载中...</div>}
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <div className="content">
        {showResults ? (
          renderResults()
        ) : (
          pair.length === 2 && config && (
            <div className="compare-voting">
              <h2>请选择您认为更强的干员</h2>
              <div className="operator-comparison">
                <div className="operator-card" onClick={() => handleVote(pair[0], pair[1])}>
                  <img src={config.DICT_PIC_URL[pair[0]]} alt={pair[0]} />
                  <div className="operator-name">{pair[0]}</div>
                </div>
                <div className="vs-badge">VS</div>
                <div className="operator-card" onClick={() => handleVote(pair[1], pair[0])}>
                  <img src={config.DICT_PIC_URL[pair[1]]} alt={pair[1]} />
                  <div className="operator-name">{pair[1]}</div>
                </div>
              </div>
              <div className="action-buttons">
                <button onClick={fetchPair}>跳过</button>
                <button onClick={handleViewResults}>查看总排名</button>
                <button onClick={handleViewPersonalResults}>我的投票</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );

}

export default ArknightsComparePage;