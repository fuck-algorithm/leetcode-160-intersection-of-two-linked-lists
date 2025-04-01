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

  // 添加蓝色箭头标记（用于指针A）
  defs.append('marker')
    .attr('id', 'arrow-marker-a')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 3)
    .attr('refY', 0)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#3498db');

  // 添加紫色箭头标记（用于指针B）
  defs.append('marker')
    .attr('id', 'arrow-marker-b')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 3)
    .attr('refY', 0)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#9b59b6');

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
    
  // 添加glow滤镜 - 用于节点发光效果
  const glowFilter = defs.append('filter')
    .attr('id', 'glow-filter')
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%');
  
  glowFilter.append('feGaussianBlur')
    .attr('stdDeviation', '3')
    .attr('result', 'blur');
  
  glowFilter.append('feComposite')
    .attr('in', 'SourceGraphic')
    .attr('in2', 'blur')
    .attr('operator', 'over');
  
  // 添加文本发光滤镜
  const textGlowFilter = defs.append('filter')
    .attr('id', 'text-glow')
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%');
  
  textGlowFilter.append('feGaussianBlur')
    .attr('stdDeviation', '2')
    .attr('result', 'blur');
  
  textGlowFilter.append('feComposite')
    .attr('in', 'SourceGraphic')
    .attr('in2', 'blur')
    .attr('operator', 'over');
  
  // 添加径向渐变 - 用于闪光效果
  const blueRadialGradient = defs.append('radialGradient')
    .attr('id', 'blue-radial-gradient')
    .attr('cx', '50%')
    .attr('cy', '50%')
    .attr('r', '50%')
    .attr('fx', '50%')
    .attr('fy', '50%');
  
  blueRadialGradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#3498db')
    .attr('stop-opacity', '1');
  
  blueRadialGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#2980b9')
    .attr('stop-opacity', '0.6');
  
  // 添加紫色径向渐变
  const purpleRadialGradient = defs.append('radialGradient')
    .attr('id', 'purple-radial-gradient')
    .attr('cx', '50%')
    .attr('cy', '50%')
    .attr('r', '50%')
    .attr('fx', '50%')
    .attr('fy', '50%');
  
  purpleRadialGradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#9b59b6')
    .attr('stop-opacity', '1');
  
  purpleRadialGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#8e44ad')
    .attr('stop-opacity', '0.6');
  
  // 添加橙色径向渐变
  const orangeRadialGradient = defs.append('radialGradient')
    .attr('id', 'orange-radial-gradient')
    .attr('cx', '50%')
    .attr('cy', '50%')
    .attr('r', '50%')
    .attr('fx', '50%')
    .attr('fy', '50%');
  
  orangeRadialGradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#f39c12')
    .attr('stop-opacity', '1');
  
  orangeRadialGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#e67e22')
    .attr('stop-opacity', '0.6');
    
  return defs;
}; 