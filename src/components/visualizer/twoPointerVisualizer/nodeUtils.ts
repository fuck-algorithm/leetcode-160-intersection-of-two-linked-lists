import { ListNode, LinkedListData } from '../../../types';
import { isNodeInIntersection } from '../LinkedListRenderer';

export interface NodeCalculationResult {
  preIntersectionNodesA: ListNode[];
  preIntersectionNodesB: ListNode[];
  intersectionNodes: ListNode[];
  hasIntersection: boolean;
  intersectionNodeIndexA: number;
  intersectionNodeIndexB: number;
  totalEffectiveNodes: number;
  startX: number;
  isPointerAInListB: boolean;
  isPointerBInListA: boolean;
}

// 计算链表节点相关信息
export function calculateNodeInfo(
  listA: LinkedListData,
  listB: LinkedListData,
  intersectionNode: ListNode | null,
  currentNodeA: ListNode | null,
  currentNodeB: ListNode | null,
  leftOffset: number,
  nodeSpacing: number,
  nodeRadius: number
) {
  // 提前处理边缘情况 - 两个链表都为空
  if (listA.nodes.length === 0 && listB.nodes.length === 0) {
    return {
      preIntersectionNodesA: [],
      preIntersectionNodesB: [],
      intersectionNodes: [],
      startX: leftOffset,
      hasIntersection: false,
      totalEffectiveNodes: 0
    };
  }
  
  // 分析链表结构，识别相交部分
  const preIntersectionNodesA: ListNode[] = [];
  const preIntersectionNodesB: ListNode[] = [];
  const intersectionNodes: ListNode[] = [];
  
  // 处理相交情况
  let hasIntersection = !!intersectionNode;
  
  // 如果有相交节点，计算相交前的节点
  if (hasIntersection && intersectionNode) {
    // 遍历链表A找到相交前的节点
    let currentA: ListNode | null = listA.head;
    while (currentA && currentA !== intersectionNode) {
      preIntersectionNodesA.push(currentA);
      currentA = currentA.next;
    }
    
    // 遍历链表B找到相交前的节点
    let currentB: ListNode | null = listB.head;
    while (currentB && currentB !== intersectionNode) {
      preIntersectionNodesB.push(currentB);
      currentB = currentB.next;
    }
    
    // 收集相交部分的节点
    let current: ListNode | null = intersectionNode;
    while (current) {
      intersectionNodes.push(current);
      current = current.next;
    }
  } else {
    // 没有相交，所有节点都是相交前的节点
    let currentA: ListNode | null = listA.head;
    while (currentA) {
      preIntersectionNodesA.push(currentA);
      currentA = currentA.next;
    }
    
    let currentB: ListNode | null = listB.head;
    while (currentB) {
      preIntersectionNodesB.push(currentB);
      currentB = currentB.next;
    }
  }
  
  // 确保至少有一个节点，避免布局问题
  const effectiveNodesA = Math.max(1, preIntersectionNodesA.length);
  const effectiveNodesB = Math.max(1, preIntersectionNodesB.length);
  
  // 计算相交部分的起始X坐标 - 确保视觉上的平衡
  // 相交部分应该比两个链表单独部分更靠右
  const maxPreLength = Math.max(
    preIntersectionNodesA.length, 
    preIntersectionNodesB.length
  );
  
  // 相交部分的起始X坐标应该在两个链表单独部分的最右侧再加一点距离
  const startX = leftOffset + maxPreLength * nodeSpacing + (hasIntersection ? nodeSpacing / 2 : 0);
  
  // 计算有效节点总数（用于确定SVG大小）
  // 有效节点包括：链表A和B的非共享部分，以及共享部分
  // 使用Math.max确保即使链表为空，也有最小的显示空间
  const totalEffectiveNodes = Math.max(
    4, // 最小节点数，确保有足够的显示空间
    maxPreLength + (hasIntersection ? intersectionNodes.length : 0)
  );
  
  return {
    preIntersectionNodesA,
    preIntersectionNodesB,
    intersectionNodes,
    startX,
    hasIntersection,
    totalEffectiveNodes
  };
}

// 计算链表节点相关信息
export const calculateNodeInfoOld = (
  listA: LinkedListData,
  listB: LinkedListData,
  intersectionNode: ListNode | null,
  currentNodeA: ListNode | null,
  currentNodeB: ListNode | null,
  leftOffset: number,
  nodeSpacing: number,
  nodeRadius: number
): NodeCalculationResult => {
  // 寻找相交节点的索引
  const intersectionNodeIndexA = intersectionNode ? 
    listA.nodes.findIndex(node => node === intersectionNode) : -1;
  const intersectionNodeIndexB = intersectionNode ? 
    listB.nodes.findIndex(node => node === intersectionNode) : -1;
  
  // 计算链表A和B（相交前部分）的节点
  const preIntersectionNodesA = intersectionNodeIndexA !== -1 
    ? listA.nodes.slice(0, intersectionNodeIndexA) 
    : listA.nodes;
  
  const preIntersectionNodesB = intersectionNodeIndexB !== -1 
    ? listB.nodes.slice(0, intersectionNodeIndexB) 
    : listB.nodes;
  
  // 计算相交部分的节点
  const intersectionNodes = (intersectionNodeIndexA !== -1 && intersectionNodeIndexA < listA.nodes.length)
    ? listA.nodes.slice(intersectionNodeIndexA)
    : [];

  // 判断链表是否实际相交
  const hasIntersection = intersectionNodes.length > 0;
  
  // 计算实际节点数量（包括相交部分）
  const totalEffectiveNodes = Math.max(
    preIntersectionNodesA.length + (hasIntersection ? intersectionNodes.length : 0),
    preIntersectionNodesB.length + (hasIntersection ? intersectionNodes.length : 0)
  );
  
  // 计算相交部分的起始X坐标
  const startX = Math.max(
    leftOffset + preIntersectionNodesA.length * nodeSpacing + nodeRadius,
    leftOffset + preIntersectionNodesB.length * nodeSpacing + nodeRadius
  );
  
  // 确定当前指针A是否在链表B中（在B的非相交部分）
  const isPointerAInListB = currentNodeA !== null && 
                         !isNodeInIntersection(currentNodeA, intersectionNodes) && 
                         listB.nodes.includes(currentNodeA);

  // 确定当前指针B是否在链表A中（在A的非相交部分）
  const isPointerBInListA = currentNodeB !== null && 
                         !isNodeInIntersection(currentNodeB, intersectionNodes) && 
                         listA.nodes.includes(currentNodeB);
  
  return {
    preIntersectionNodesA,
    preIntersectionNodesB,
    intersectionNodes,
    hasIntersection,
    intersectionNodeIndexA,
    intersectionNodeIndexB,
    totalEffectiveNodes,
    startX,
    isPointerAInListB,
    isPointerBInListA
  };
}; 