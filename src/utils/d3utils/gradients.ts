import * as d3 from 'd3';

/**
 * 添加渐变定义
 */
export const addGradient = (
  defs: d3.Selection<SVGDefsElement, unknown, null, undefined>, 
  id: string, 
  startColor: string, 
  endColor: string
) => {
  const gradient = defs.append('linearGradient')
    .attr('id', id)
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '100%');
    
  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', startColor);
    
  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', endColor);
};

/**
 * 创建所有可视化所需的渐变定义
 */
export const createGradientDefs = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
  const defs = svg.append('defs');

  // 添加节点渐变
  addGradient(defs, 'node-a-gradient', '#3498db', '#2980b9');
  addGradient(defs, 'node-b-gradient', '#9b59b6', '#8e44ad');
  addGradient(defs, 'intersection-gradient', '#e74c3c', '#c0392b');
  addGradient(defs, 'current-gradient', '#f39c12', '#d35400');
  
  // 添加指针A的渐变填充（蓝色系）
  addGradient(defs, 'pointer-a-gradient', '#3498db', '#2980b9');
  // 添加指针B的渐变填充（紫色系）
  addGradient(defs, 'pointer-b-gradient', '#9b59b6', '#8e44ad');
  // 添加相交时的渐变填充（黄色）
  addGradient(defs, 'pointers-meet-gradient', '#f39c12', '#d35400');
  // 添加当两个指针相遇时的特殊渐变
  addGradient(defs, 'pointers-meet-special-gradient', '#f1c40f', '#f39c12');

  // 添加箭头标记
  defs.append('marker')
    .attr('id', 'arrow-marker')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 3)
    .attr('refY', 0)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#2c3e50');

  // 添加红色箭头标记（用于相交部分）
  defs.append('marker')
    .attr('id', 'arrow-marker-intersection')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 3)
    .attr('refY', 0)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#e74c3c');

  // 添加特殊指示箭头（用于指针跳转）
  defs.append('marker')
    .attr('id', 'special-arrow-marker')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 3)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-6L12,0L0,6')
    .attr('fill', '#f39c12');
    
  return defs;
}; 