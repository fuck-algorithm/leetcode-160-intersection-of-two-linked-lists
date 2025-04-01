import * as d3 from 'd3';
import { setupGradients } from '../gradients';

/**
 * 创建和设置链表的SVG环境
 */
export const setupLinkedListSVG = (
  container: HTMLDivElement, 
  nodeCount: number, 
  id: string
): d3.Selection<SVGSVGElement, unknown, null, undefined> => {
  // 清除现有内容
  d3.select(container).selectAll('*').remove();
  
  // 创建SVG元素
  const svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', 200)
    .attr('viewBox', `0 0 ${nodeCount * 120} 200`)
    .attr('preserveAspectRatio', 'xMinYMin meet');

  // 设置渐变和箭头标记
  setupGradients(svg, id);
  
  return svg;
}; 