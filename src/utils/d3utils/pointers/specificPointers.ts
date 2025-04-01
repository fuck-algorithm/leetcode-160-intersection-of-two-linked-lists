import * as d3 from 'd3';
import { addPointerHighlight } from './pointerHighlight';

/**
 * 为指针A添加高亮效果 - 专门用于指针A，确保所有地方指针A的效果一致
 */
export const addPointerAHighlight = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number,
  y: number,
  nodeRadius: number,
  scale: number = 1,
  nodeValue?: number | string,
  fontSize: number = 24
) => {
  // 指针A使用蓝色渐变
  return addPointerHighlight(svg, x, y, nodeRadius, '#2980b9', 'pointer-a-gradient', scale, nodeValue, fontSize);
};

/**
 * 为指针B添加高亮效果 - 专门用于指针B，确保所有地方指针B的效果一致
 */
export const addPointerBHighlight = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number,
  y: number,
  nodeRadius: number,
  scale: number = 1,
  nodeValue?: number | string,
  fontSize: number = 24
) => {
  // 指针B使用紫色渐变
  return addPointerHighlight(svg, x, y, nodeRadius, '#8e44ad', 'pointer-b-gradient', scale, nodeValue, fontSize);
};

/**
 * 添加相交点高亮效果 - 当两个指针在同一节点相遇时使用
 */
export const addIntersectionHighlight = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number,
  y: number,
  nodeRadius: number,
  scale: number = 1,
  nodeValue?: number | string,
  fontSize: number = 24
) => {
  // 为节点创建一个固定位置的组
  const nodeGroup = svg.append('g')
    .attr('transform', `translate(${x}, ${y})`);
  
  // 1. 添加节点本身（圆形背景）
  nodeGroup.append('circle')
    .attr('r', nodeRadius)
    .attr('fill', 'url(#pointers-meet-special-gradient)')
    .attr('stroke', '#f39c12')
    .attr('stroke-width', 1.5 * scale);
  
  // 2. 计算指针标签的位置和大小
  const pointerRadius = nodeRadius * 0.6;  // 指针圆圈的半径
  const pointerDistance = nodeRadius * 2.5;   // 指针距离节点中心的距离
  
  // 3. 添加指针A的圆圈和标签 - 放在上方
  const pointerGroupA = nodeGroup.append('g')
    .attr('transform', `translate(0, ${-pointerDistance})`);
  
  pointerGroupA.append('circle')
    .attr('r', pointerRadius)
    .attr('fill', '#3498db')
    .attr('stroke', 'white')
    .attr('stroke-width', 2);
  
  pointerGroupA.append('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', 'white')
    .attr('font-size', `${fontSize * 0.7}px`)
    .attr('font-weight', 'bold')
    .text('A');
  
  // 添加指针A的垂直线和箭头
  const lineStartY_A = -pointerDistance + pointerRadius;
  const lineEndY_A = -nodeRadius;
  
  // 画主线
  nodeGroup.append('line')
    .attr('x1', 0)
    .attr('y1', lineStartY_A)
    .attr('x2', 0)
    .attr('y2', lineEndY_A)
    .attr('stroke', '#3498db')
    .attr('stroke-width', 2.5);
  
  // 添加三角形箭头
  const arrowSize = 8;
  nodeGroup.append('path')
    .attr('d', `M${-arrowSize},${lineEndY_A + arrowSize} L0,${lineEndY_A} L${arrowSize},${lineEndY_A + arrowSize} Z`)
    .attr('fill', '#3498db');
  
  // 4. 添加指针B的圆圈和标签 - 放在下方
  const pointerGroupB = nodeGroup.append('g')
    .attr('transform', `translate(0, ${pointerDistance})`);
  
  pointerGroupB.append('circle')
    .attr('r', pointerRadius)
    .attr('fill', '#9b59b6')
    .attr('stroke', 'white')
    .attr('stroke-width', 2);
  
  pointerGroupB.append('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', 'white')
    .attr('font-size', `${fontSize * 0.7}px`)
    .attr('font-weight', 'bold')
    .text('B');
  
  // 添加指针B的垂直线和箭头
  const lineStartY_B = pointerDistance - pointerRadius;
  const lineEndY_B = nodeRadius;
  
  // 画主线
  nodeGroup.append('line')
    .attr('x1', 0)
    .attr('y1', lineStartY_B)
    .attr('x2', 0)
    .attr('y2', lineEndY_B)
    .attr('stroke', '#9b59b6')
    .attr('stroke-width', 2.5);
  
  // 添加三角形箭头
  nodeGroup.append('path')
    .attr('d', `M${-arrowSize},${lineEndY_B - arrowSize} L0,${lineEndY_B} L${arrowSize},${lineEndY_B - arrowSize} Z`)
    .attr('fill', '#9b59b6');
  
  // 5. 添加节点值
  nodeGroup.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.3em')
    .attr('fill', 'white')
    .attr('font-size', `${fontSize * scale}px`)
    .attr('font-weight', 'bold')
    .attr('pointer-events', 'none')
    .text(nodeValue !== undefined ? nodeValue : '');
  
  return svg;
}; 