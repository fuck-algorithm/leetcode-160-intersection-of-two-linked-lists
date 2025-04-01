import * as d3 from 'd3';
import { ListNode } from '../../../types';
import { isNodeInIntersection } from '../LinkedListRenderer';
import { renderPointerAJump } from './renderPointerAJump';
import { renderPointerBJump } from './renderPointerBJump';

/**
 * 渲染指针跳转 - 当指针从一个链表的末尾跳转到另一个链表的开头
 */
export const renderPointerJumps = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  listA: ListNode[],
  listB: ListNode[],
  intersectionNodes: ListNode[],
  currentNodeA: ListNode | null,
  currentNodeB: ListNode | null,
  leftOffset: number,
  startX: number,
  topRowY: number,
  bottomRowY: number,
  intersectionRowY: number,
  nodeRadius: number,
  nodeSpacing: number,
  fontSize: number,
  scale: number = 1
) => {
  // 确定当前指针A是否在链表B中（在B的非相交部分）
  const isPointerAInListB = currentNodeA !== null && 
                           !isNodeInIntersection(currentNodeA, intersectionNodes) && 
                           listB.includes(currentNodeA);
  
  // 确定当前指针B是否在链表A中（在A的非相交部分）
  const isPointerBInListA = currentNodeB !== null && 
                           !isNodeInIntersection(currentNodeB, intersectionNodes) && 
                           listA.includes(currentNodeB);
  
  // 渲染指针A的跳转（如果指针A从链表A跳转到了链表B）
  if (isPointerAInListB) {
    renderPointerAJump(
      svg, 
      listA,
      listB, 
      intersectionNodes, 
      currentNodeA, 
      leftOffset, 
      startX, 
      topRowY, 
      bottomRowY, 
      intersectionRowY,
      nodeRadius, 
      nodeSpacing, 
      fontSize, 
      scale
    );
  }
  
  // 渲染指针B的跳转（如果指针B从链表B跳转到了链表A）
  if (isPointerBInListA) {
    renderPointerBJump(
      svg, 
      listA, 
      listB,
      intersectionNodes, 
      currentNodeB, 
      leftOffset, 
      startX, 
      topRowY, 
      bottomRowY, 
      intersectionRowY,
      nodeRadius, 
      nodeSpacing, 
      fontSize, 
      scale
    );
  }
}; 