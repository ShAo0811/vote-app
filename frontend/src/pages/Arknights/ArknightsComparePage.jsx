import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../static/css/ArknightsComparePage.css';
import { checkArknightsPersonalUnlock } from '../../utils/api';
import UserStatsContext from '../../context/UserStatsContext';


function ArknightsComparePage({ refreshHeaderStats }) {
  const [config, setConfig] = useState(null);
  const [pair, setPair] = useState([]);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [personalVotes, setPersonalVotes] = useState({});
  const [voteCount, setVoteCount] = useState(0);
  const [voteLoading, setVoteLoading] = useState(false);
  const [pairLoading, setPairLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [personalUnlocked, setPersonalUnlocked] = useState(false);
  const { userStats, refreshUserStats } = useContext(UserStatsContext);

  useEffect(() => {
    setMounted(true); // 页面挂载后触发动画
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      checkArknightsPersonalUnlock(userId).then(data => {
        if (data.unlocked) {
          setPersonalUnlocked(true);
        } else {
          setPersonalUnlocked(false);
        }
      });
    }
  }, []);

  const fetchPair = async () => {
    try {
      setPairLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/arknights/new_compare`, {
        credentials: 'include'
      });
      const data = await res.json();
      console.log('新干员对:', data);
      setPair([...data]);
    } catch (err) {
      setError('获取干员失败');
    } finally {
      setPairLoading(false);
    }
  };



  const handleVote = async (winner, loser) => {
    if (!userStats || userStats.remaining_tickets <= 0) {
      setError("票数不足，无法继续投票");
      setTimeout(() => setError(null), 1500);
      return;
    }

    try {
      setVoteLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/arknights/save_score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          win: winner,
          lose: loser,
          user_id: localStorage.getItem('user_id'),
        })
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(`投票成功！剩余 ${data.remaining_tickets} 票`);
        await fetchPair();
        refreshUserStats();  // ✅ 刷新下拉菜单票数
      } else {
        setError(data.error || '投票失败');
      }

      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 1500);
    } catch (err) {
      setError("投票失败，请稍后重试");
    } finally {
      setVoteLoading(false);
    }
  }


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
    fetch(configURL, {
      credentials: 'include'
    })
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
    <div className={`compare-container ${mounted ? 'page-fade-in' : ''}`}>
      <div className="back-button fixed-back" onClick={() => navigate('/arknights')}>
        ← 返回明日方舟
      </div>

      <h1>干员强度对比投票</h1>

      <div className="content">
        {(successMessage || error) && (
          <div className={`feedback-bar ${successMessage ? 'success' : 'error'}`}>
            {successMessage || error}
          </div>
        )}

        {showResults ? (
          renderResults()
        ) : (
          pair.length === 2 && config && (
            <div className="wrapper">
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
                  <button
                    onClick={() => navigate('/arknights/personal')}
                    disabled={!personalUnlocked}
                    title={personalUnlocked ? '' : '投票满 30 次后解锁'}
                    style={!personalUnlocked ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                  >
                    个人榜单
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>

  );

}

export default ArknightsComparePage;

//{(voteLoading || pairLoading) && <div className="loading">加载中...</div>}