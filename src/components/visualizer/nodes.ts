import * as d3 from 'd3';
import { ListNode } from '../../types';

export const drawNodes = (
  nodeGroups: d3.Selection<SVGGElement, ListNode, SVGSVGElement, unknown>,
  currentNode: ListNode | null,
  nodeRadius: number,
  intersectionIndex: number,
  id: string,
  intersectionNode: ListNode | null
) => {
  // 绘制节点圆圈
  const circles = nodeGroups.append('circle')
    .attr('r', nodeRadius)
    .attr('fill', (d, i) => {
      if (i >= intersectionIndex && intersectionIndex >= 0) 
        return `url(#intersection-gradient-${id})`;
      if (d === currentNode) 
        return `url(#current-gradient-${id})`;
      return `url(#node-gradient-${id})`;
    })
    .attr('stroke', d => {
      if (d === currentNode) return '#ffc107';
      return 'none';
    })
    .attr('stroke-width', 3)
    .style('filter', 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))');

  // 添加节点值文本
  nodeGroups.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.3em')
    .attr('fill', 'white')
    .attr('font-size', '16px')
    .attr('font-weight', 'bold')
    .text(d => d.val);

  // 添加节点交互效果
  addNodeInteractions(nodeGroups, currentNode, nodeRadius);
};

// 添加节点交互效果
const addNodeInteractions = (
  nodeGroups: d3.Selection<SVGGElement, ListNode, SVGSVGElement, unknown>,
  currentNode: ListNode | null,
  nodeRadius: number
) => {
  nodeGroups.on('mouseover', function(event, d) {
    d3.select(this).select('circle')
      .transition()
      .duration(200)
      .attr('r', nodeRadius * 1.1);
      
    if (!d3.select(this).select('.node-tooltip').size()) {          
      d3.select(this).append('text')
        .attr('class', 'node-tooltip')
        .attr('text-anchor', 'middle')
        .attr('y', -nodeRadius - 10)
        .attr('fill', 'var(--dark-color)')
        .attr('font-size', '12px')
        .text(`值: ${d.val}`)
        .attr('opacity', 0)
        .transition()
        .duration(200)
        .attr('opacity', 1);
    }
  }).on('mouseout', function(event, d) {
    d3.select(this).select('circle')
      .transition()
      .duration(200)
      .attr('r', nodeRadius);
      
    d3.select(this).select('.node-tooltip')
      .transition()
      .duration(200)
      .attr('opacity', 0)
      .remove();
  });
};
