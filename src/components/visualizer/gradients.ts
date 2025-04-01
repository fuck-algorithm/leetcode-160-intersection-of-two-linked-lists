import * as d3 from 'd3';

export const setupGradients = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  id: string
) => {
  // 创建渐变和标记
  const defs = svg.append('defs');
  
  // 普通节点渐变
  const nodeGradient = defs.append('linearGradient')
    .attr('id', `node-gradient-${id}`)
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '100%');
  
  nodeGradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#3498db');
  
  nodeGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#2980b9');

  // 交点节点渐变
  const intersectionGradient = defs.append('linearGradient')
    .attr('id', `intersection-gradient-${id}`)
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '100%');
  
  intersectionGradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#e74c3c');
  
  intersectionGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#c0392b');

  // 当前节点渐变
  const currentGradient = defs.append('linearGradient')
    .attr('id', `current-gradient-${id}`)
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '100%');
  
  currentGradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#f39c12');
  
  currentGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#d35400');

  // 添加箭头标记
  defs.append('marker')
    .attr('id', `arrow-${id}`)
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 8)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', 'var(--dark-color)');
}; 