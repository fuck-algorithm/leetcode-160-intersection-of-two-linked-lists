import * as d3 from 'd3';
import { LinkedListData } from '../../types';

export const drawConnections = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  linkedList: LinkedListData,
  nodeRadius: number,
  nodeSpacing: number,
  verticalOffset: number,
  intersectionIndex: number,
  id: string
) => {
  // 添加连接线
  for (let i = 0; i < linkedList.nodes.length - 1; i++) {
    const isTargetIntersection = i + 1 >= intersectionIndex && intersectionIndex >= 0;
      
    const path = svg.append('path')
      .attr('d', `M${(i * nodeSpacing) + nodeRadius * 2 + 20} ${verticalOffset} H${(i+1) * nodeSpacing + 20}`)
      .attr('stroke', isTargetIntersection ? 'var(--accent-color)' : 'var(--dark-color)')
      .attr('stroke-width', 3)
      .attr('fill', 'none')
      .attr('marker-end', `url(#arrow-${id})`)
      .attr('opacity', 0);

    // 箭头动画
    path.transition()
      .duration(300)
      .delay(i * 200)
      .attr('opacity', 1)
      .transition()
      .duration(500)
      .attr('stroke-dasharray', isTargetIntersection ? '4,4' : 'none')
      .attr('d', function() {
        const pathData = d3.select(this).attr('d');
        return pathData;
      });
  }
}; 