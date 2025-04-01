import { ListNode } from '../../../../types';

/**
 * 记录指针位置（调试用）
 */
export const logPointerPositions = (currentNodeA: ListNode | null, currentNodeB: ListNode | null) => {
  if (currentNodeA) {
    console.log(`指针A当前在节点值: ${currentNodeA.val}`);
  }
  if (currentNodeB) {
    console.log(`指针B当前在节点值: ${currentNodeB.val}`);
  }
}; 