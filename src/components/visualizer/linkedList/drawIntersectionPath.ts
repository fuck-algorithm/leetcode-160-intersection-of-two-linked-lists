import * as d3 from 'd3';
import { LinkedListData, ListNode } from '../../../types';

/**
 * 绘制两个链表之间的相交路径
 */
export const drawIntersectionPath = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  intersectionNode: ListNode,
  intersectionIndex: number,
  otherList: LinkedListData,
  nodeRadius: number,
  nodeSpacing: number,
  verticalOffset: number
) => {
  // 找到在otherList中相交点的索引
  const otherIntersectionIndex = otherList.nodes.findIndex(node => node === intersectionNode);
  
  if (otherIntersectionIndex >= 0 && intersectionIndex >= 0) {
    // 构建一条从list-b到list-a相交节点的路径
    const otherListNodeX = otherIntersectionIndex * nodeSpacing + nodeRadius + 20;
    const thisListNodeX = intersectionIndex * nodeSpacing + nodeRadius + 20;
    
    // 创建一条弯曲的路径，连接两个列表的相交点位置
    const connectingPath = svg.append('path')
      .attr('class', 'intersection-path')
      .attr('d', `M${thisListNodeX},${verticalOffset - 60} C${thisListNodeX - 40},${verticalOffset - 100} ${otherListNodeX + 40},${verticalOffset - 100} ${otherListNodeX},${verticalOffset - 60}`)
      .attr('stroke', 'var(--accent-color)')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5')
      .attr('fill', 'none')
      .attr('opacity', 0);

    // 添加动画效果
    connectingPath.transition()
      .duration(1000)
      .attr('opacity', 1)
      .on('end', function() {
        d3.select(this)
          .transition()
          .duration(800)
          .attr('stroke-dasharray', '5,5')
          .attr('stroke-dashoffset', -20)
          .ease(d3.easeLinear)
          .on('end', function repeat() {
            d3.select(this)
              .transition()
              .duration(800)
              .attr('stroke-dashoffset', -40)
              .ease(d3.easeLinear)
              .on('end', repeat);
          });
      });

    // 添加相交文本说明
    svg.append('text')
      .attr('x', thisListNodeX)
      .attr('y', verticalOffset - 70)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', 'var(--accent-color)')
      .attr('font-weight', 'bold')
      .text('相交点')
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .delay(500)
      .attr('opacity', 1);
  }
}; 