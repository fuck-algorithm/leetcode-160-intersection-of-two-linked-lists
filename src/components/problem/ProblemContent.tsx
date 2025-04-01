import React from 'react';

export const ProblemContent: React.FC = () => {
  return (
    <div className="problem-content">
      <p>
        给你两个单链表的头节点 <code>headA</code> 和 <code>headB</code> ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 <code>null</code> 。
      </p>

      <div className="example-section">
        <p>图示两个链表在节点 <code>c1</code> 开始相交：</p>
        <div className="example-image-description">
          <div className="list-illustration">
            <p>A:</p>
            <div className="node-chain">
              <div className="node">a1</div>
              <div className="arrow">→</div>
              <div className="node">a2</div>
              <div className="arrow">→</div>
              <div className="node intersection">c1</div>
              <div className="arrow">→</div>
              <div className="node intersection">c2</div>
              <div className="arrow">→</div>
              <div className="node intersection">c3</div>
            </div>
          </div>
          <div className="list-illustration">
            <p>B:</p>
            <div className="node-chain">
              <div className="node">b1</div>
              <div className="arrow">→</div>
              <div className="node">b2</div>
              <div className="arrow">→</div>
              <div className="node">b3</div>
              <div className="arrow">↗</div>
            </div>
          </div>
        </div>
      </div>

      <div className="problem-notes">
        <p>题目数据 <strong>保证</strong> 整个链式结构中不存在环。</p>
        <p>注意，函数返回结果后，链表必须 <strong>保持其原始结构</strong> 。</p>
      </div>

      <div className="custom-test-description">
        <h3>自定义评测:</h3>
        <p>评测系统 的输入如下（你设计的程序 <strong>不适用</strong> 此输入）：</p>
        <ul>
          <li><code>intersectVal</code> - 相交的起始节点的值。如果不存在相交节点，这一值为 <code>0</code></li>
          <li><code>listA</code> - 第一个链表</li>
          <li><code>listB</code> - 第二个链表</li>
          <li><code>skipA</code> - 在 <code>listA</code> 中（从头节点开始）跳到交叉节点的节点数</li>
          <li><code>skipB</code> - 在 <code>listB</code> 中（从头节点开始）跳到交叉节点的节点数</li>
        </ul>
        <p>
          评测系统将根据这些输入创建链式数据结构，并将两个头节点 <code>headA</code> 和 <code>headB</code> 传递给你的程序。
          如果程序能够正确返回相交节点，那么你的解决方案将被 <strong>视作正确答案</strong> 。
        </p>
      </div>
    </div>
  );
}; 