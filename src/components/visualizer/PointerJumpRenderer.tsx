import * as d3 from 'd3';
import { ListNode } from '../../types';
import { drawJumpCurve } from '../../utils/d3utils/paths';
import { addPointerMarker, addPointerAHighlight, addPointerBHighlight } from '../../utils/d3utils/pointers';
import { isNodeInIntersection } from './LinkedListRenderer';

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

/**
 * 渲染指针A从链表A跳转到链表B的过程
 */
const renderPointerAJump = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  listA: ListNode[],
  listB: ListNode[],
  intersectionNodes: ListNode[],
  currentNodeA: ListNode | null,
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
  if (!currentNodeA) return;
  
  // 指针A在链表B中的位置
  const indexInB = listB.findIndex(node => node === currentNodeA);
  if (indexInB !== -1) {
    // 计算目标节点在链表B中的确切位置
    const targetX = leftOffset + indexInB * nodeSpacing;
    const targetY = bottomRowY;
    
    // 查找链表A的最后一个节点位置，决定跳转线的起点
    let lastNodeX, lastNodeY;
    
    // 如果有相交部分，使用相交部分的最后一个节点作为跳转起点
    if (intersectionNodes.length > 0) {
      // 计算相交部分的最后一个节点的X坐标
      const intersectionLastIndex = intersectionNodes.length - 1;
      lastNodeX = startX + intersectionLastIndex * nodeSpacing + nodeRadius;
      lastNodeY = intersectionRowY; // 相交部分在中间行
    } else {
      // 没有相交部分，使用链表A的最后一个节点作为跳转起点
      const listALastIndex = listA.length - 1;
      lastNodeX = leftOffset + listALastIndex * nodeSpacing + nodeRadius;
      lastNodeY = topRowY;
    }
    
    // 绘制跳跃曲线 - 使用更明显的蓝色（指针A的颜色）
    // 从链表A的最后一个节点右侧出发，到目标节点的左侧
    drawJumpCurve(svg, lastNodeX, lastNodeY, targetX - nodeRadius, targetY, '#2980b9', nodeRadius, scale);
    
    // 添加指针A的标记
    addPointerMarker(svg, targetX, targetY, nodeRadius, '#2980b9', 'pA', scale);
    
    // 添加指针A在链表B中的高亮效果
    addPointerAHighlight(svg, targetX, targetY, nodeRadius, scale, currentNodeA.val);
  }
};

/**
 * 渲染指针B从链表B跳转到链表A的过程
 */
const renderPointerBJump = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  listA: ListNode[],
  listB: ListNode[],
  intersectionNodes: ListNode[],
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
  if (!currentNodeB) return;
  
  // 指针B在链表A中的位置
  const indexInA = listA.findIndex(node => node === currentNodeB);
  if (indexInA !== -1) {
    // 计算目标节点在链表A中的确切位置
    const targetX = leftOffset + indexInA * nodeSpacing;
    const targetY = topRowY;
    
    // 查找链表B的最后一个节点位置，决定跳转线的起点
    let lastNodeX, lastNodeY;
    
    // 如果有相交部分，使用相交部分的最后一个节点作为跳转起点
    if (intersectionNodes.length > 0) {
      // 计算相交部分的最后一个节点的X坐标
      const intersectionLastIndex = intersectionNodes.length - 1;
      lastNodeX = startX + intersectionLastIndex * nodeSpacing + nodeRadius;
      lastNodeY = intersectionRowY; // 相交部分在中间行
    } else {
      // 没有相交部分，使用链表B的最后一个节点作为跳转起点
      const listBLastIndex = listB.length - 1;
      lastNodeX = leftOffset + listBLastIndex * nodeSpacing + nodeRadius;
      lastNodeY = bottomRowY;
    }
    
    // 绘制跳跃曲线 - 使用更明显的紫色（指针B的颜色）
    // 从链表B的最后一个节点右侧出发，到目标节点的左侧
    drawJumpCurve(svg, lastNodeX, lastNodeY, targetX - nodeRadius, targetY, '#8e44ad', nodeRadius, scale);
    
    // 添加指针B的标记
    addPointerMarker(svg, targetX, targetY, nodeRadius, '#8e44ad', 'pB', scale);
    
    // 添加指针B在链表A中的高亮效果
    addPointerBHighlight(svg, targetX, targetY, nodeRadius, scale, currentNodeB.val);
  }
}; 