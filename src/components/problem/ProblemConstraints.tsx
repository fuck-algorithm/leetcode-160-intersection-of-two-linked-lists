import React from 'react';

export const ProblemConstraints: React.FC = () => {
  return (
    <>
      <div className="constraints">
        <h3>提示:</h3>
        <ul>
          <li><code>listA</code> 中节点数目为 <code>m</code></li>
          <li><code>listB</code> 中节点数目为 <code>n</code></li>
          <li><code>1 &lt;= m, n &lt;= 3 * 10^4</code></li>
          <li><code>1 &lt;= Node.val &lt;= 10^5</code></li>
          <li><code>0 &lt;= skipA &lt;= m</code></li>
          <li><code>0 &lt;= skipB &lt;= n</code></li>
          <li>如果 <code>listA</code> 和 <code>listB</code> 没有交点，<code>intersectVal</code> 为 <code>0</code></li>
          <li>如果 <code>listA</code> 和 <code>listB</code> 有交点，<code>intersectVal == listA[skipA] == listB[skipB]</code></li>
        </ul>
      </div>

      <div className="follow-up">
        <h3>进阶:</h3>
        <p>你能否设计一个时间复杂度 <code>O(m + n)</code>、仅用 <code>O(1)</code> 内存的解决方案?</p>
      </div>
    </>
  );
}; 