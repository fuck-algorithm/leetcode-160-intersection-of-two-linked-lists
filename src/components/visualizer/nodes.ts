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
    .attr('r', 0) // 开始时半径为0
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

  // 节点出现动画
  circles.transition()
    .duration(500)
    .delay((d, i) => i * 200)
    .attr('r', nodeRadius)
    .on('end', function(d, i) {
      // 如果是相交节点，添加脉冲动画
      if (i >= intersectionIndex && intersectionIndex >= 0) {
        addIntersectionPulse(this, nodeRadius);
      }
      
      // 当前节点高亮动画
      if (d === currentNode) {
        addCurrentNodePulse(this, nodeRadius);
      }
    });

  // 添加节点值文本
  nodeGroups.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.3em')
    .attr('fill', 'white')
    .attr('font-size', '16px')
    .attr('font-weight', 'bold')
    .attr('opacity', 0)
    .text(d => d.val)
    .transition()
    .duration(300)
    .delay((d, i) => i * 200 + 200)
    .attr('opacity', 1);

  // 添加交互效果
  addNodeInteractions(nodeGroups, currentNode, nodeRadius);
};

// 为相交节点添加脉冲动画
const addIntersectionPulse = (element: Element, nodeRadius: number) => {
  // 安全地处理DOM节点，获取当前圆圈的父节点并找到节点发光效果
  const parent = element.parentElement;
  
  if (parent) {
    const glowElement = parent.querySelector('.node-glow');
    if (glowElement) {
      d3.select(glowElement)
        .attr('opacity', 0.6)
        .attr('fill', 'rgba(231, 76, 60, 0.3)')
        .transition()
        .duration(1000)
        .attr('r', nodeRadius * 1.4)
        .attr('opacity', 0)
        .on('end', function repeat() {
          d3.select(this)
            .attr('r', nodeRadius * 1.2)
            .attr('opacity', 0.6)
            .transition()
            .duration(1000)
            .attr('r', nodeRadius * 1.4)
            .attr('opacity', 0)
            .on('end', repeat);
        });
    }
  }
};

// 为当前节点添加脉冲动画
const addCurrentNodePulse = (element: Element, nodeRadius: number) => {
  d3.select(element)
    .transition()
    .duration(800)
    .attr('r', nodeRadius * 1.1)
    .transition()
    .duration(800)
    .attr('r', nodeRadius)
    .on('end', function repeat() {
      d3.select(this)
        .transition()
        .duration(800)
        .attr('r', nodeRadius * 1.1)
        .transition()
        .duration(800)
        .attr('r', nodeRadius)
        .on('end', repeat);
    });
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
      .duration(300)
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
        .duration(300)
        .attr('opacity', 1);
    }
  }).on('mouseout', function(event, d) {
    d3.select(this).select('circle')
      .transition()
      .duration(300)
      .attr('r', d === currentNode ? nodeRadius * 1.1 : nodeRadius);
      
    d3.select(this).select('.node-tooltip')
      .transition()
      .duration(300)
      .attr('opacity', 0)
      .remove();
  });
}; 