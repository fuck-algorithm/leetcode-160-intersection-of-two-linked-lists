import React from 'react';

export const Example3: React.FC = () => {
  return (
    <div className="example">
      <h3>示例 3:</h3>
      <div className="example-image-description">
        <div className="list-illustration">
          <p>A:</p>
          <div className="node-chain">
            <div className="node">2</div>
            <div className="arrow">→</div>
            <div className="node">6</div>
            <div className="arrow">→</div>
            <div className="node">4</div>
          </div>
        </div>
        <div className="list-illustration">
          <p>B:</p>
          <div className="node-chain">
            <div className="node">1</div>
            <div className="arrow">→</div>
            <div className="node">5</div>
          </div>
        </div>
      </div>
      <div className="example-details">
        <p><strong>输入:</strong> intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2</p>
        <p><strong>输出:</strong> No intersection</p>
        <p><strong>解释:</strong> 从各自的表头开始算起，链表 A 为 [2,6,4]，链表 B 为 [1,5]。</p>
        <p>由于这两个链表不相交，所以 intersectVal 必须为 0，而 skipA 和 skipB 可以是任意值。</p>
        <p>这两个链表不相交，因此返回 null 。</p>
      </div>
    </div>
  );
}; 