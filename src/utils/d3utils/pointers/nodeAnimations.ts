import * as d3 from 'd3';

/**
 * 添加节点被选中时的高亮效果 - 简单的静态高亮，无扩散动画
 */
export const addNodeSelectedEffect = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number,
  y: number,
  nodeRadius: number,
  color: string = '#3498db',
  scale: number = 1
) => {
  const group = svg.append('g')
    .attr('class', 'node-selected-effect')
    .attr('transform', `translate(${x}, ${y})`);
  
  // 添加简单的静态高亮环
  group.append('circle')
    .attr('r', nodeRadius * 1.3)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 3 * scale)
    .attr('stroke-opacity', 0.6);
  
  return group;
};

/**
 * 添加指针节点相交时的高亮效果 - 简单的静态高亮，无扩散动画
 */
export const addPointersIntersectionEffect = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number,
  y: number,
  nodeRadius: number,
  scale: number = 1
) => {
  const group = svg.append('g')
    .attr('class', 'pointers-intersection-effect')
    .attr('transform', `translate(${x}, ${y})`);
  
  // 添加简单的静态高亮环
  group.append('circle')
    .attr('r', nodeRadius * 1.4)
    .attr('fill', 'none')
    .attr('stroke', '#f39c12')
    .attr('stroke-width', 4 * scale)
    .attr('stroke-opacity', 0.7);
  
  return group;
};
