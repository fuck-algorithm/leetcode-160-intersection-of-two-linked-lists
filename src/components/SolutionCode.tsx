import React from 'react';
import { SolutionType } from '../types';

interface SolutionCodeProps {
  solutionType: SolutionType;
}

const SolutionCode: React.FC<SolutionCodeProps> = () => {
  return (
    <div className="solution-code">
      <div className="solution-explanation">
        <h3>双指针解法原理</h3>
        <p>
          该算法的巧妙之处在于，通过让两个指针 ptrA 和 ptrB 分别从链表 A 和链表 B 的头部开始遍历：
        </p>
        <ol>
          <li>当 ptrA 到达链表 A 的末尾时，直接跳转到链表 B 的头部</li>
          <li>当 ptrB 到达链表 B 的末尾时，直接跳转到链表 A 的头部</li>
        </ol>
        <p>
          这样，两个指针最终会相遇在以下两种情况之一：
        </p>
        <ul>
          <li>如果两个链表相交，指针会在交点处相遇</li>
          <li>如果两个链表不相交，指针会在遍历完两个链表后仍然不相遇</li>
        </ul>
        <p>
          <strong>时间复杂度：</strong> O(m+n)，其中 m 和 n 分别是两个链表的长度<br />
          <strong>空间复杂度：</strong> O(1)，只使用了两个指针
        </p>
      </div>
      
      <h3>TypeScript 代码实现</h3>
      <pre>
        <code>{`/**
 * 单链表定义：
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */
function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
    // 如果任一链表为空，则不存在交点
    if (!headA || !headB) return null;
    
    let ptrA: ListNode | null = headA;
    let ptrB: ListNode | null = headB;
    
    // 当一个指针到达链表末尾时，直接跳转到另一个链表的头部
    // 如果链表相交，指针最终会相遇
    // 如果链表不相交，两个指针在完成循环后仍不会相遇
    while (ptrA !== ptrB) {
        ptrA = ptrA ? ptrA.next : headB;
        ptrB = ptrB ? ptrB.next : headA;
    }
    
    // 此时，ptrA和ptrB要么都指向交点
    // 要么都指向null（无交点）
    return ptrA;
}`}</code>
      </pre>
    </div>
  );
};

export default SolutionCode; 