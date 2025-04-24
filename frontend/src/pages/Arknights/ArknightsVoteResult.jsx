
import React, { useEffect, useState } from 'react';
import '../../static/css/ArknightsVoteResult.css';

function ArknightsVoteResult() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🌐 ArknightsVoteResult 页面加载 ✅");
    const fetchResults = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/arknights/view_final_order`);
        const data = await res.json();
        console.log("📦 获取到的数据:", data);
        setResults(data || []);
      } catch (err) {
        console.error("❌ 获取失败:", err);
        setError('加载失败，请稍后重试。');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    window.scrollTo(0, 0);
  }, []);

  const handleImageError = (e) => {
    console.error("⚠️ 头像加载失败:", e.target.src);
    e.target.style.display = 'none';
  };

  useEffect(() => {
    console.log("📊 当前结果数:", results.length);
  }, [results]);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="compare-container">
      <div className="content">
        <div className="vote-results">
          <h2>干员总投票结果</h2>
          <div className="results-list">
            {results.map((op, index) => {
              const name = op.name.trim();
              const imagePath = `/images/${name}.png`;
              const winRate = op.voteCount > 0
                ? (((op.score + op.voteCount) / (2 * op.voteCount)) * 100).toFixed(1)
                : 0;
  
              return (
                <div key={index} className="result-item">
                  <div className="rank">#{index + 1}</div>
                  <div className="item-image">
                    <img src={imagePath} alt={name} onError={handleImageError} />
                  </div>
                  <div className="item-details">
                    <h3>{name}</h3>
                    <div className="progress-container">
                      <div className="progress-bar" style={{ width: `${winRate}%` }}></div>
                    </div>
                    <div className="vote-info">
                      <span>胜率: {winRate}%</span>
                      <span>得分: {op.score}</span>
                      <span>比较次数: {op.voteCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
  
  
}

export default ArknightsVoteResult;
