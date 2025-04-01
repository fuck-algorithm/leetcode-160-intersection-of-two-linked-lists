import * as d3 from 'd3';
import { ListNode } from '../../../types';
import { drawJumpCurve } from '../../../utils/d3utils/paths';
import { addPointerMarker, addPointerAHighlight } from '../../../utils/d3utils/pointers';

/**
 * 渲染指针A从链表A跳转到链表B的过程
 */
export const renderPointerAJump = (
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