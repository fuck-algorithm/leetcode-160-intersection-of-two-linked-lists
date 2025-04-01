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