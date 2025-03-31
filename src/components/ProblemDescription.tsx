import React from 'react';

const ProblemDescription: React.FC = () => {
  return (
    <div className="problem-description">
      <div className="problem-section">
        <h2 className="problem-title">160. 相交链表</h2>
        
        <div className="problem-tags">
          <span className="difficulty-tag">简单</span>
          <span className="tag"><i className="tag-icon">🏷️</i> 相关标签</span>
          <span className="tag"><i className="tag-icon">🏢</i> 相关企业</span>
        </div>

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

          <div className="examples">
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
          </div>

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
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription; 