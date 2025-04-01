import React from 'react';

export const Example1: React.FC = () => {
  return (
    <div className="example">
      <h3>示例 1:</h3>
      <div className="example-image-description">
        <div className="list-illustration">
          <p>A:</p>
          <div className="node-chain">
            <div className="node">4</div>
            <div className="arrow">→</div>
            <div className="node">1</div>
            <div className="arrow">→</div>
            <div className="node intersection">8</div>
            <div className="arrow">→</div>
            <div className="node intersection">4</div>
            <div className="arrow">→</div>
            <div className="node intersection">5</div>
          </div>
        </div>
        <div className="list-illustration">
          <p>B:</p>
          <div className="node-chain">
            <div className="node">5</div>
            <div className="arrow">→</div>
            <div className="node">6</div>
            <div className="arrow">→</div>
            <div className="node">1</div>
            <div className="arrow">↗</div>
          </div>
        </div>
      </div>
      <div className="example-details">
        <p><strong>输入:</strong> intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3</p>
        <p><strong>输出:</strong> Intersected at '8'</p>
        <p><strong>解释:</strong> 相交节点的值为 8 （注意，如果两个链表相交则不能为 0）。</p>
        <p>从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,6,1,8,4,5]。</p>
        <p>在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。</p>
        <p>- 请注意相交节点的值不为 1，因为在链表 A 和链表 B 之中值为 1 的节点（A 中第二个节点和 B 中第三个节点）是不同的节点。换句话说，它们在内存中指向两个不同的位置，而链表 A 和链表 B 中值为 8 的节点（A 中第三个节点，B 中第四个节点）在内存中指向相同的位置。</p>
      </div>
    </div>
  );
}; 