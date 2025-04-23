import React, { useEffect, useState } from 'react';
import '../../static/css/ArknightsVoteResult.css';

function ArknightsVoteResult() {
  const [config, setConfig] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configRes, resultRes] = await Promise.all([
          fetch('/arknights_config.json'),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/arknights/view_final_order`)
        ]);
        const configData = await configRes.json();
        const resultData = await resultRes.json();
        setConfig(configData);
        setResults(resultData);
      } catch (err) {
        setError('加载投票结果失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>加载中...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!config || results.length === 0) return <p>暂无结果</p>;

  return (
    <div className="vote-results">
      <h2>明日方舟投票总榜</h2>
      <div className="results-list">
        {results.map((item, index) => (
          <div key={item.name} className="result-item">
            <div className="rank">#{index + 1}</div>
            <div className="item-image">
              <img src={config.DICT_PIC_URL[item.name]} alt={item.name} />
            </div>
            <div className="item-details">
              <h3>{item.name}</h3>
              <div className="stats">
                <span>胜率: {item.rate}%</span>
                <span>得分: {item.score.toFixed(1)}</span>
                <span>比较次数: {item.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArknightsVoteResult;
