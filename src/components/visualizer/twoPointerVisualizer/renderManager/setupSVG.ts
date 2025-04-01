import * as d3 from 'd3';
import { createGradientDefs } from '../../../../utils/d3utils/gradients';

/**
 * 设置渲染环境SVG
 */
export const setupSVG = (
  containerRef: HTMLDivElement,
  viewBoxWidth: number,
  viewBoxHeight: number
): d3.Selection<SVGSVGElement, unknown, null, undefined> => {
  // 彻底清除现有内容
  const containerSelection = d3.select(containerRef);
  containerSelection.selectAll('*').remove();
  containerSelection.html(''); // 额外的清理步骤，确保DOM完全清空

  // 创建主SVG
  const svg = containerSelection
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
    .attr('preserveAspectRatio', 'xMinYMid meet');

  // 创建渐变和样式定义
  createGradientDefs(svg);
  
  return svg;
}; 