import React from 'react';

export const Example2: React.FC = () => {
  return (
    <div className="example">
      <h3>示例 2:</h3>
      <div className="example-image-description">
        <div className="list-illustration">
          <p>A:</p>
          <div className="node-chain">
            <div className="node">1</div>
            <div className="arrow">→</div>
            <div className="node">9</div>
            <div className="arrow">→</div>
            <div className="node">1</div>
            <div className="arrow">→</div>
            <div className="node intersection">2</div>
            <div className="arrow">→</div>
            <div className="node intersection">4</div>
          </div>
        </div>
        <div className="list-illustration">
          <p>B:</p>
          <div className="node-chain">
            <div className="node">3</div>
            <div className="arrow">↗</div>
          </div>
        </div>
      </div>
      <div className="example-details">
        <p><strong>输入:</strong> intersectVal = 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1</p>
        <p><strong>输出:</strong> Intersected at '2'</p>
        <p><strong>解释:</strong> 相交节点的值为 2 （注意，如果两个链表相交则不能为 0）。</p>
        <p>从各自的表头开始算起，链表 A 为 [1,9,1,2,4]，链表 B 为 [3,2,4]。</p>
        <p>在 A 中，相交节点前有 3 个节点；在 B 中，相交节点前有 1 个节点。</p>
      </div>
    </div>
  );
}; 