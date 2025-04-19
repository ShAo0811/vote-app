import React from 'react';
import '../../../static/css/ArknightsVoteResult.css'; // 引入样式文件

function ArknightsVoteResults({ items, votes }) {
  // 根据投票数量排序
  const sortedItems = [...items].sort((a, b) => {
    const aVotes = votes[a.id] || 0;
    const bVotes = votes[b.id] || 0;
    return bVotes - aVotes;
  });

  // 计算总投票数
  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);

  return (
    <div className="vote-results">
      <h2>投票结果</h2>
      {totalVotes === 0 ? (
        <p className="no-votes">暂无投票</p>
      ) : (
        <div className="results-list">
          {sortedItems.map((item, index) => {
            const voteCount = votes[item.id] || 0;
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
            
            return (
              <div key={item.id} className="result-item">
                <div className="rank">{index + 1}</div>
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <div className="progress-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="vote-info">
                    <span className="vote-count">{voteCount} 票</span>
                    <span className="vote-percentage">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ArknightsVoteResults; 