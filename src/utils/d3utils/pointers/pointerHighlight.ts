import * as d3 from 'd3';

/**
 * 为指针添加统一的高亮效果 - 基础函数，被指针A和指针B的高亮函数调用
 */
export const addPointerHighlight = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number,
  y: number,
  nodeRadius: number,
  color: string,
  gradientId: string,
  scale: number = 1,
  nodeValue?: number | string,
  fontSize: number = 24
) => {
  // 确定高亮环的颜色
  const pointerColor = color.includes('2980b9') ? '#3498db' : 
                      color.includes('8e44ad') ? '#9b59b6' : 
                      '#f39c12';
  
  // 为这个节点添加一个固定组
  const nodeGroup = svg.append('g')
    .attr('transform', `translate(${x}, ${y})`);
  
  // 1. 添加节点本身（圆形背景）
  nodeGroup.append('circle')
    .attr('r', nodeRadius)
    .attr('fill', `url(#${gradientId})`)
    .attr('stroke', color)
    .attr('stroke-width', 1.5 * scale);
  
  // 2. 计算指针标签的位置和大小
  const pointerRadius = nodeRadius * 0.6;  // 指针圆圈的半径
  const pointerDistance = nodeRadius * 2.5;   // 指针距离节点中心的距离
  
  // 根据指针类型决定位置(A在上方，B在下方)
  const pointerY = color.includes('2980b9') ? -pointerDistance : pointerDistance;
  const pointerX = 0; // 居中对齐
  
  // 3. 添加指针圆圈和标签
  const pointerGroup = nodeGroup.append('g')
    .attr('transform', `translate(${pointerX}, ${pointerY})`);
  
  // 添加指针圆圈
  pointerGroup.append('circle')
    .attr('r', pointerRadius)
    .attr('fill', pointerColor)
    .attr('stroke', 'white')
    .attr('stroke-width', 2);
  
  // 添加指针标签
  const pointerLabel = color.includes('2980b9') ? 'A' : 
                      color.includes('8e44ad') ? 'B' : 
                      '✓';
  
  pointerGroup.append('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', 'white')
    .attr('font-size', `${fontSize * 0.7}px`)
    .attr('font-weight', 'bold')
    .text(pointerLabel);
  
  // 4. 添加箭头线 - 垂直连接
  const lineStartY = pointerY > 0 ? pointerY - pointerRadius : pointerY + pointerRadius;
  const lineEndY = pointerY > 0 ? nodeRadius : -nodeRadius;
  const arrowDirection = pointerY > 0 ? -1 : 1; // 箭头方向
  
  // 画主线
  nodeGroup.append('line')
    .attr('x1', 0)
    .attr('y1', lineStartY)
    .attr('x2', 0)
    .attr('y2', lineEndY)
    .attr('stroke', pointerColor)
    .attr('stroke-width', 2.5);
  
  // 添加三角形箭头
  const arrowSize = 8;
  nodeGroup.append('path')
    .attr('d', `M${-arrowSize},${lineEndY + arrowSize * arrowDirection} L0,${lineEndY} L${arrowSize},${lineEndY + arrowSize * arrowDirection} Z`)
    .attr('fill', pointerColor);
  
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