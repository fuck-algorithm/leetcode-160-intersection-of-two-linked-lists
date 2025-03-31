import * as d3 from 'd3';

/**
 * 添加指针标记 - 用于在当前节点上方显示指针标志
 */
export const addPointerMarker = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number,
  y: number,
  nodeRadius: number,
  color: string,
  label: string,
  scale: number = 1
) => {
  const pointerGroup = svg.append('g')
    .attr('transform', `translate(${x}, ${y - nodeRadius * 2})`)
    .attr('class', 'pointer');
  
  // 绘制三角形指针
  const pointerSize = 12 * scale;
  pointerGroup.append('path')
    .attr('d', `M0,0 L${-pointerSize},${-pointerSize} L${pointerSize},${-pointerSize} Z`)
    .attr('fill', color);
  
  // 添加指针标签
  pointerGroup.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', -pointerSize - 5)
    .attr('fill', color)
    .attr('font-size', `${14 * scale}px`)
    .attr('font-weight', 'bold')
    .text(label);
    
  // 添加闪烁动画
  pointerGroup.append('animate')
    .attr('attributeName', 'opacity')
    .attr('values', '1;0.6;1')
    .attr('dur', '1.5s')
    .attr('repeatCount', 'indefinite');
    
  return pointerGroup;
};

/**
 * 为指针添加统一的高亮效果 - 基础函数，被指针A和指针B的高亮函数调用
 */
const addPointerHighlight = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number,
  y: number,
  nodeRadius: number,
  color: string,
  gradientId: string,
  scale: number = 1,
  nodeValue?: number | string
) => {
  // 1. 设置节点填充色为对应的渐变色
  svg.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', nodeRadius)
    .attr('fill', `url(#${gradientId})`)
    .attr('stroke', '#ffc107')
    .attr('stroke-width', 3 * scale);
  
  // 2. 添加第一层脉动高亮边框
  svg.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', nodeRadius + 5 * scale)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 2 * scale)
    .attr('opacity', 0.7)
    .attr('class', 'current-node-highlight')
    .append('animate')
    .attr('attributeName', 'opacity')
    .attr('values', '0.7;0.3;0.7')
    .attr('dur', '1.5s')
    .attr('repeatCount', 'indefinite');
  
  // 3. 添加魔力转圈圈动画 - 第一层 (慢速旋转)
  const outerCircle1 = svg.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', nodeRadius + 8 * scale)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 1.5 * scale)
    .attr('stroke-dasharray', '5,3')
    .attr('opacity', 0.5)
    .attr('class', 'outer-highlight');
    
  // 添加旋转动画
  outerCircle1.append('animateTransform')
    .attr('attributeName', 'transform')
    .attr('type', 'rotate')
    .attr('from', '0 ' + x + ' ' + y)
    .attr('to', '360 ' + x + ' ' + y)
    .attr('dur', '4s')
    .attr('repeatCount', 'indefinite');
    
  // 4. 添加魔力转圈圈动画 - 第二层 (快速反向旋转)
  const outerCircle2 = svg.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', nodeRadius + 12 * scale)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 1 * scale)
    .attr('stroke-dasharray', '3,5')
    .attr('opacity', 0.3)
    .attr('class', 'outer-highlight-2');
    
  // 添加反向旋转动画
  outerCircle2.append('animateTransform')
    .attr('attributeName', 'transform')
    .attr('type', 'rotate')
    .attr('from', '360 ' + x + ' ' + y)
    .attr('to', '0 ' + x + ' ' + y)
    .attr('dur', '7s')
    .attr('repeatCount', 'indefinite');
    
  // 5. 添加节点值（确保在最上层显示）
  // 直接添加节点值文本，不检查是否存在
  svg.append('text')
    .attr('class', `node-value-${Math.round(x)}-${Math.round(y)}`)
    .attr('x', x)
    .attr('y', y)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.3em')
    .attr('fill', 'white')
    .attr('font-size', `${14 * scale}px`)
    .attr('font-weight', 'bold')
    .attr('pointer-events', 'none')
    .text(nodeValue !== undefined ? nodeValue : '');
  
  return svg;
};

/**
 * 为指针A添加高亮效果 - 专门用于指针A，确保所有地方指针A的效果一致
 */
export const addPointerAHighlight = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number,
  y: number,
  nodeRadius: number,
  scale: number = 1,
  nodeValue?: number | string
) => {
  // 指针A使用蓝色渐变
  return addPointerHighlight(svg, x, y, nodeRadius, '#2980b9', 'pointer-a-gradient', scale, nodeValue);
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
  nodeValue?: number | string
) => {
  // 指针B使用紫色渐变
  return addPointerHighlight(svg, x, y, nodeRadius, '#8e44ad', 'pointer-b-gradient', scale, nodeValue);
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
  nodeValue?: number | string
) => {
  // 1. 设置节点填充色为黄色渐变
  svg.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', nodeRadius)
    .attr('fill', 'url(#pointers-meet-special-gradient)')
    .attr('stroke', '#ffc107')
    .attr('stroke-width', 3 * scale);
    
  // 2. 添加相交点外环
  svg.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', nodeRadius * 1.3)
    .attr('fill', 'none')
    .attr('stroke', '#f1c40f')
    .attr('stroke-width', 2 * scale)
    .attr('stroke-opacity', 0.8);
    
  // 3. 添加脉动动画到相交点外环
  svg.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', nodeRadius * 1.8)
    .attr('fill', 'none')
    .attr('stroke', '#f1c40f')
    .attr('stroke-width', 1.5 * scale)
    .attr('opacity', 0.5)
    .append('animate')
    .attr('attributeName', 'r')
    .attr('values', `${nodeRadius * 1.5};${nodeRadius * 2.2};${nodeRadius * 1.5}`)
    .attr('dur', '2s')
    .attr('repeatCount', 'indefinite');
    
  // 4. 添加魔力转圈圈动画 - 第一层
  const rotatingCircle1 = svg.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', nodeRadius * 1.5)
    .attr('fill', 'none')
    .attr('stroke', '#f1c40f')
    .attr('stroke-width', 2 * scale)
    .attr('stroke-dasharray', '5,5')
    .attr('opacity', 0.4);
    
  // 添加旋转动画
  rotatingCircle1.append('animateTransform')
    .attr('attributeName', 'transform')
    .attr('type', 'rotate')
    .attr('from', '0 ' + x + ' ' + y)
    .attr('to', '360 ' + x + ' ' + y)
    .attr('dur', '8s')
    .attr('repeatCount', 'indefinite');
    
  // 5. 添加魔力转圈圈动画 - 第二层
  const rotatingCircle2 = svg.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', nodeRadius * 2)
    .attr('fill', 'none')
    .attr('stroke', '#f1c40f')
    .attr('stroke-width', 1 * scale)
    .attr('stroke-dasharray', '2,7')
    .attr('opacity', 0.3);
    
  // 添加反向旋转动画
  rotatingCircle2.append('animateTransform')
    .attr('attributeName', 'transform')
    .attr('type', 'rotate')
    .attr('from', '360 ' + x + ' ' + y)
    .attr('to', '0 ' + x + ' ' + y)
    .attr('dur', '12s')
    .attr('repeatCount', 'indefinite');
  
  // 添加节点值（确保在最上层显示）
  // 直接添加节点值文本，显式设置值
  svg.append('text')
    .attr('class', `node-value-${Math.round(x)}-${Math.round(y)}`)
    .attr('x', x)
    .attr('y', y)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.3em')
    .attr('fill', 'white')
    .attr('font-size', `${14 * scale}px`)
    .attr('font-weight', 'bold')
    .attr('pointer-events', 'none')
    .text(nodeValue !== undefined ? nodeValue : '');
  
  return svg;
}; 