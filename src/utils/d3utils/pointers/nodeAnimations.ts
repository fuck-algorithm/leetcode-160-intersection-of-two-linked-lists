import * as d3 from 'd3';

/**
 * 添加节点被选中时的波纹动画效果 - 蓝色波纹动画
 * 类似于第一张图中的效果，蓝色节点被选中时产生多层波纹
 */
export const addNodeSelectedEffect = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number,
  y: number,
  nodeRadius: number,
  color: string = '#3498db', // 默认蓝色
  scale: number = 1
) => {
  const group = svg.append('g')
    .attr('class', 'node-selected-effect')
    .attr('transform', `translate(${x}, ${y})`);
  
  // 添加多层波纹效果
  for (let i = 0; i < 3; i++) {
    const delayFactor = i * 700; // 错开动画开始时间
    
    // 添加波纹圆圈
    const circle = group.append('circle')
      .attr('r', nodeRadius)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2.5 * scale)
      .attr('stroke-opacity', 0.8)
      .attr('stroke-dasharray', '3,3') // 虚线效果
      .style('transform-origin', 'center')
      .style('transform-box', 'fill-box');
    
    // 第一个动画：扩散
    const animateRipple = () => {
      circle
        .attr('stroke-opacity', 0.8)
        .attr('r', nodeRadius)
        .transition()
        .duration(2000)
        .attr('r', nodeRadius * 3)
        .attr('stroke-opacity', 0)
        .on('end', animateRipple); // 循环动画
    };
    
    // 延迟启动动画
    setTimeout(animateRipple, delayFactor);
  }
  
  // 添加内部发光效果
  const innerGlow = group.append('circle')
    .attr('r', nodeRadius * 1.1)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 3 * scale)
    .attr('filter', 'url(#glow-filter)');
  
  // 脉冲动画
  const pulseInnerGlow = () => {
    innerGlow
      .transition()
      .duration(1000)
      .attr('stroke-opacity', 1)
      .attr('r', nodeRadius * 1.2)
      .transition()
      .duration(1000)
      .attr('stroke-opacity', 0.5)
      .attr('r', nodeRadius * 1.1)
      .on('end', pulseInnerGlow); // 循环动画
  };
  
  pulseInnerGlow();
  
  return group;
};

/**
 * 添加指针节点相交时的特效 - 黄色/橙色的相交高亮效果
 * 类似于第二张图中的效果，当两个指针相交时产生的特殊黄色高亮
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
  
  // 添加外部光环 - 黄色渐变
  const outerHalo = group.append('circle')
    .attr('r', nodeRadius * 1.6)
    .attr('fill', 'none')
    .attr('stroke', '#f39c12')
    .attr('stroke-width', 3 * scale)
    .attr('stroke-opacity', 0.3)
    .attr('filter', 'url(#glow-filter)');
  
  // 添加第二层光环
  const middleHalo = group.append('circle')
    .attr('r', nodeRadius * 1.3)
    .attr('fill', 'none') 
    .attr('stroke', '#f1c40f')
    .attr('stroke-width', 3 * scale)
    .attr('stroke-opacity', 0.5);
  
  // 添加内部光环
  const innerHalo = group.append('circle')
    .attr('r', nodeRadius * 1.1)
    .attr('fill', 'none')
    .attr('stroke', '#f39c12')
    .attr('stroke-width', 4 * scale)
    .attr('stroke-opacity', 0.7);
  
  // 脉冲动画 - 外部光环
  const pulseOuterHalo = () => {
    outerHalo
      .transition()
      .duration(1500)
      .attr('stroke-opacity', 0.5)
      .attr('r', nodeRadius * 1.8)
      .transition() 
      .duration(1500)
      .attr('stroke-opacity', 0.3)
      .attr('r', nodeRadius * 1.6)
      .on('end', pulseOuterHalo);
  };
  
  // 脉冲动画 - 中间光环
  const pulseMiddleHalo = () => {
    middleHalo
      .transition()
      .duration(1200)
      .attr('stroke-opacity', 0.7)
      .attr('r', nodeRadius * 1.4)
      .transition()
      .duration(1200) 
      .attr('stroke-opacity', 0.5)
      .attr('r', nodeRadius * 1.3)
      .on('end', pulseMiddleHalo);
  };
  
  // 脉冲动画 - 内部光环
  const pulseInnerHalo = () => {
    innerHalo
      .transition()
      .duration(900)
      .attr('stroke-opacity', 0.9)
      .attr('r', nodeRadius * 1.15)
      .transition()
      .duration(900)
      .attr('stroke-opacity', 0.7)
      .attr('r', nodeRadius * 1.1)
      .on('end', pulseInnerHalo);
  };
  
  // 启动所有动画
  pulseOuterHalo();
  setTimeout(() => pulseMiddleHalo(), 300); // 错开动画开始时间
  setTimeout(() => pulseInnerHalo(), 600);  // 错开动画开始时间
  
  return group;
}; 