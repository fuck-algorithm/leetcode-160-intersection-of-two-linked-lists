import * as d3 from 'd3';
import { ListNode } from '../../../types';

/**
 * 渲染从链表A和链表B非相交部分到相交部分的连接线
 * 使用简洁的直角折线设计，更清晰易懂
 */
export const renderIntersectionConnectors = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  preIntersectionNodesA: ListNode[],
  preIntersectionNodesB: ListNode[],
  intersectionStartX: number,
  intersectionStartY: number,
  leftOffset: number,
  topRowY: number,
  bottomRowY: number,
  nodeRadius: number,
  nodeSpacing: number,
  fontSize: number,
  scale: number = 1
) => {
  // 如果没有相交节点，就不需要连接器
  if (intersectionStartX <= 0) return;
  
  // 计算链表A的最后一个非相交节点位置
  const lastNodeAX = preIntersectionNodesA.length > 0 
    ? leftOffset + (preIntersectionNodesA.length - 1) * nodeSpacing 
    : leftOffset;
  const lastNodeAY = topRowY;
  
  // 计算链表B的最后一个非相交节点位置
  const lastNodeBX = preIntersectionNodesB.length > 0 
    ? leftOffset + (preIntersectionNodesB.length - 1) * nodeSpacing 
    : leftOffset;
  const lastNodeBY = bottomRowY;
  
  // 从链表A连接到相交部分（从上方）
  renderElbowConnector(
    svg, 
    lastNodeAX, 
    lastNodeAY, 
    intersectionStartX, 
    intersectionStartY, 
    '#3498db', // 链表A的蓝色
    nodeRadius,
    'top'
  );
  
  // 从链表B连接到相交部分（从下方）
  renderElbowConnector(
    svg, 
    lastNodeBX, 
    lastNodeBY, 
    intersectionStartX, 
    intersectionStartY, 
    '#9b59b6', // 链表B的紫色
    nodeRadius,
    'bottom'
  );
};

/**
 * 绘制简洁的直角折线连接器
 * 使用"L"形或直线连接，更清晰易懂
 */
const renderElbowConnector = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string,
  nodeRadius: number,
  direction: 'top' | 'bottom'
) => {
  // 如果不需要绘制连接线
  if (startX <= 0) return;
  
  // 调整起点和终点，考虑节点的半径
  const adjustedStartX = startX + nodeRadius;
  const adjustedEndX = endX - nodeRadius;
  
  // 计算中间转折点
  // 转折点X位置：在起点和终点之间，靠近终点
  const turnX = adjustedEndX - 20;
  
  let pathData: string;
  
  // 根据方向选择连接方式
  if (direction === 'top') {
    // 从上方连接：先水平向右，再斜向下到交点
    // 使用平滑的二次贝塞尔曲线
    const midY = startY + (endY - startY) * 0.3;
    pathData = `M${adjustedStartX},${startY} 
                L${turnX},${startY} 
                Q${turnX + 15},${startY} ${turnX + 15},${midY}
                L${turnX + 15},${endY}
                L${adjustedEndX},${endY}`;
  } else {
    // 从下方连接：先水平向右，再斜向上到交点
    const midY = startY + (endY - startY) * 0.7;
    pathData = `M${adjustedStartX},${startY} 
                L${turnX},${startY} 
                Q${turnX + 15},${startY} ${turnX + 15},${midY}
                L${turnX + 15},${endY}
                L${adjustedEndX},${endY}`;
  }
  
  // 绘制连接线
  svg.append('path')
    .attr('d', pathData)
    .attr('stroke', color)
    .attr('stroke-width', 2.5)
    .attr('stroke-opacity', 0.85)
    .attr('fill', 'none')
    .attr('marker-end', 'url(#arrow-marker)')
    .style('stroke-linecap', 'round')
    .style('stroke-linejoin', 'round')
    .style('pointer-events', 'none');
}; 