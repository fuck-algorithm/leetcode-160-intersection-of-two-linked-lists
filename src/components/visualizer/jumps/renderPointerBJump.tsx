import * as d3 from 'd3';
import { ListNode } from '../../../types';
import { drawJumpCurve } from '../../../utils/d3utils/paths';
import { addPointerMarker, addPointerBHighlight } from '../../../utils/d3utils/pointers';

/**
 * 渲染指针B从链表B跳转到链表A的过程
 */
export const renderPointerBJump = (
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