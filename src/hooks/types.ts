import { ListNode } from '../types';

// 保存算法执行的历史记录，用于前进/后退功能
export interface StepHistory {
  currentNodeA: ListNode | null;
  currentNodeB: ListNode | null;
  visitedNodes: Set<ListNode>;
  message: string;
  completed: boolean;
} 