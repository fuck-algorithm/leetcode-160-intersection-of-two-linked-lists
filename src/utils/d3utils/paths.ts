import * as d3 from 'd3';

/**
 * 绘制连接器 - 用于绘制节点之间的常规连接线
 */
export const drawConnector = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number, 
  color: string,
  nodeRadius: number,
  scale: number = 1
) => {
  // 创建平滑的贝塞尔曲线路径
  // 更精细的控制点计算，让曲线更加平滑
  const dx = x2 - x1;
  const dy = y2 - y1;
  
  const controlPoint1X = x1 + dx * 0.3;
  const controlPoint1Y = y1 + dy * 0.1;
  const controlPoint2X = x1 + dx * 0.7;
  const controlPoint2Y = y1 + dy * 0.9;
  
  // 创建贝塞尔曲线路径，确保精确到达目标节点边缘
  svg.append('path')
    .attr('d', `M${x1},${y1} C${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${x2-nodeRadius-2},${y2}`)
    .attr('stroke', color)
    .attr('stroke-width', 2 * scale)
    .attr('fill', 'none')
    .attr('marker-end', 'url(#arrow-marker)')
    .style('stroke-linecap', 'round');
    
  // 添加额外的短线段，确保完全连接到圆的边缘
  svg.append('line')
    .attr('x1', x2-nodeRadius-2)
    .attr('y1', y2)
    .attr('x2', x2-nodeRadius+1)
    .attr('y2', y2)
    .attr('stroke', color)
    .attr('stroke-width', 2 * scale)
    .style('stroke-linecap', 'round');
    
  // 添加一个小小的高亮点，强调连接处
  svg.append('circle')
    .attr('cx', x2-nodeRadius)
    .attr('cy', y2)
    .attr('r', 1.5 * scale)
    .attr('fill', color)
    .attr('opacity', 0.7);
};

/**
 * 绘制指针跳跃曲线 - 用于绘制指针从一个链表跳转到另一个链表的路径
 */
export const drawJumpCurve = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number, 
  color: string,
  nodeRadius: number,
  scale: number = 1
) => {
  // 计算控制点，创建一条弧形路径
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // 控制点距离路径中点的距离
  const controlDistance = distance * 0.6;
  
  // 计算路径中点
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  // 计算法线向量 (垂直于直线的方向)
  const nx = -dy / distance;
  const ny = dx / distance;
  
  // 控制点坐标
  const controlX = midX + nx * controlDistance;
  const controlY = midY + ny * controlDistance;
  
  // 绘制双二次贝塞尔曲线
  const path = svg.append('path')
    .attr('d', `M${x1},${y1} Q${controlX},${controlY} ${x2},${y2}`)
    .attr('stroke', color)
    .attr('stroke-width', 2.5 * scale)
    .attr('fill', 'none')
    .attr('stroke-dasharray', '8,4')
    .attr('marker-end', 'url(#special-arrow-marker)')
    .attr('opacity', 0.8)
    .style('stroke-linecap', 'round');
  
  // 添加动态效果
  path.append('animate')
    .attr('attributeName', 'stroke-dashoffset')
    .attr('from', '12')
    .attr('to', '0')
    .attr('dur', '1s')
    .attr('repeatCount', 'indefinite');
    
  return path;
};