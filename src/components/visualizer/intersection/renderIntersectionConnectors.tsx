import * as d3 from 'd3';
import { ListNode } from '../../../types';

/**
 * 渲染从链表A和链表B非相交部分到相交部分的连接线
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
  
  // 从链表A连接到相交部分
  renderConnector(
    svg, 
    lastNodeAX, 
    lastNodeAY, 
    intersectionStartX, 
    intersectionStartY, 
    '#3498db', // 链表A的蓝色
    nodeRadius
  );
  
  // 从链表B连接到相交部分
  renderConnector(
    svg, 
    lastNodeBX, 
    lastNodeBY, 
    intersectionStartX, 
    intersectionStartY, 
    '#9b59b6', // 链表B的紫色
    nodeRadius
  );
};

/**
 * 绘制从非相交节点到相交部分的连接线
 */
const renderConnector = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string,
  nodeRadius: number
) => {
  // 如果不需要绘制连接线（例如没有非相交节点）
  if (startX <= 0) return;
  
  // 计算水平和垂直距离
  const horizontalDistance = endX - startX;
  const verticalDistance = endY - startY;
  
  // 改进控制点的计算方式，使曲线更平滑且避开节点
  // 调整控制点以创建更高的弧形，避免遮挡
  let pathData;
  
  // 为了避免遮挡，我们根据垂直方向来调整曲线
  const isGoingDown = verticalDistance > 0;
  const verticalFactor = Math.max(Math.abs(verticalDistance) * 0.6, 60); // 增加垂直高度以避免遮挡
  const horizontalFactor = Math.max(horizontalDistance * 0.4, 60); // 调整水平因子
  
  // 为长距离连接使用更平滑的S形曲线
  const cp1x = startX + horizontalFactor;
  const cp1y = isGoingDown ? 
    startY + verticalFactor * 0.2 : // 向下移动时，第一个控制点稍微下移
    startY - verticalFactor * 0.7; // 向上移动时，第一个控制点大幅上移
    
  const cp2x = endX - horizontalFactor;
  const cp2y = isGoingDown ?
    endY - verticalFactor * 0.7 : // 向下移动时，第二个控制点大幅上移
    endY + verticalFactor * 0.2; // 向上移动时，第二个控制点稍微下移
  
  // 调整起点和终点，考虑节点的半径
  const adjustedStartX = startX + nodeRadius;
  const adjustedEndX = endX - nodeRadius - 2;
  
  pathData = `M${adjustedStartX},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${adjustedEndX},${endY}`;
  
  // 绘制连接曲线，增加透明度提高可见性
  svg.append('path')
    .attr('d', pathData)
    .attr('stroke', color)
    .attr('stroke-width', 2.5) // 增加线宽
    .attr('stroke-opacity', 1) // 提高不透明度
    .attr('fill', 'none')
    .attr('marker-end', 'url(#arrow-marker)')
    .style('stroke-linecap', 'round')
    .style('pointer-events', 'none'); // 防止线条干扰鼠标事件
  
  // 添加额外的短线段，确保完全连接到相交部分
  svg.append('line')
    .attr('x1', adjustedEndX)
    .attr('y1', endY)
    .attr('x2', endX - nodeRadius + 1)
    .attr('y2', endY)
    .attr('stroke', color)
    .attr('stroke-width', 2.5)
    .attr('stroke-opacity', 1)
    .style('stroke-linecap', 'round')
    .style('pointer-events', 'none');
}; 