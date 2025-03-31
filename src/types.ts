export class ListNode {
  val: number;
  next: ListNode | null;
  
  constructor(val: number) {
    this.val = val;
    this.next = null;
  }
}

export enum SolutionType {
  BRUTE_FORCE = '暴力解法',
  HASH_SET = '哈希集合',
  TWO_POINTERS = '双指针'
}

export interface LinkedListData {
  head: ListNode | null;
  nodes: ListNode[];
}

export interface VisualizationState {
  listA: LinkedListData;
  listB: LinkedListData;
  currentNodeA: ListNode | null;
  currentNodeB: ListNode | null;
  intersection: ListNode | null;
  visitedNodes: Set<ListNode>;
  solutionType: SolutionType;
  step: number;
  isRunning: boolean;
  speed: number;
  completed: boolean;
  message: string;
} 