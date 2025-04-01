import React from 'react';

export const ProblemFooter: React.FC = () => {
  return (
    <>
      <div className="stats">
        <p>通过次数: 1.1M  |  提交次数: 1.6M  |  通过率: 66.8%</p>
      </div>
      
      <div className="related-topics">
        <h3>相关标签:</h3>
        <div className="tags-list">
          <span className="topic-tag">哈希表</span>
          <span className="topic-tag">链表</span>
          <span className="topic-tag">双指针</span>
        </div>
      </div>
      
      <div className="related-problems">
        <h3>相似题目:</h3>
        <div className="similar-problem">
          <span className="problem-title">两个列表的最小索引总和</span>
          <span className="difficulty">简单</span>
        </div>
      </div>
    </>
  );
}; 