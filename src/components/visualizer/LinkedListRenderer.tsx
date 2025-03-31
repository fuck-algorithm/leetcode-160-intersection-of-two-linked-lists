import * as d3 from 'd3';
import { ListNode } from '../../types';
import { addPointerMarker, addPointerAHighlight, addPointerBHighlight } from '../../utils/d3utils/pointers';

/**
 * 判断节点是否在相交部分
 */
export const isNodeInIntersection = (node: ListNode | null, intersectionNodes: ListNode[]): boolean => {
  if (!node) return false;
  // 使用对象引用相等性比较，确保是同一个节点实例
  return intersectionNodes.some(n => n === node);
};

/**
 * 绘制链表
 */
export const drawLinkedList = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  nodes: ListNode[],
  y: number,
  startX: number,
  nodeRadius: number,
  spacing: number,
  fillColor: string,
  currentNode: ListNode | null,
  pointerColor: string,
  pointerLabel: string | null,
  scale: number = 1
) => {
  nodes.forEach((node, index) => {
    const x = startX + index * spacing;
    const isCurrentNode = node === currentNode;
    
    // 绘制节点
    const nodeGroup = svg.append('g')
      .attr('transform', `translate(${x}, ${y})`)
      .attr('class', 'node');
    
    // 如果不是当前节点，则使用普通样式绘制
    if (!isCurrentNode) {
      // 绘制节点圆 - 统一使用渐变填充
      nodeGroup.append('circle')
        .attr('r', nodeRadius)
        .attr('fill', fillColor)
        .attr('stroke', 'none');  // 移除边框，保持一致性
      
      // 为非当前节点添加节点值
      nodeGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.3em')
        .attr('fill', 'white')
        .attr('font-size', `${14 * scale}px`)
        .attr('font-weight', 'bold')
        .text(node.val);
    }
    
    // 如果是当前节点且是指针选中，则不在这里渲染节点圆形（由指针高亮函数统一处理）
    // 但仍然添加指针标记
    if (isCurrentNode && pointerLabel) {
      // 添加指针标记
      addPointerMarker(svg, x, y, nodeRadius, pointerColor, pointerLabel, scale);
      
      // 根据指针类型添加统一的高亮效果，并传入节点值
      if (pointerLabel === 'pA') {
        addPointerAHighlight(svg, x, y, nodeRadius, scale, node.val);
      } else if (pointerLabel === 'pB') {
        addPointerBHighlight(svg, x, y, nodeRadius, scale, node.val);
      } 
      // 对于pA=pB的情况，在调用方处理
    }
    
    // 如果不是最后一个节点，绘制连接线 - 统一使用贝塞尔曲线
    if (index < nodes.length - 1) {
      const nextX = startX + (index + 1) * spacing;
      
      // 计算控制点 - 平滑贝塞尔曲线
      const controlX1 = x + nodeRadius + (nextX - x - 2 * nodeRadius) * 0.3;
      const controlX2 = x + nodeRadius + (nextX - x - 2 * nodeRadius) * 0.7;
      
      // 使用链表的主色调
      const lineColor = fillColor.includes('node-a') ? '#3498db' : 
                        fillColor.includes('node-b') ? '#9b59b6' : '#e74c3c';
                        
      // 根据链表选择对应的marker
      const markerEnd = fillColor.includes('intersection') ? 
                         'url(#arrow-marker-intersection)' : 'url(#arrow-marker)';
      
      // 绘制贝塞尔曲线连接
      svg.append('path')
        .attr('d', `M${x + nodeRadius},${y} C${controlX1},${y} ${controlX2},${y} ${nextX - nodeRadius - 2},${y}`)
        .attr('stroke', lineColor)
        .attr('stroke-width', 2 * scale)
        .attr('fill', 'none')
        .attr('marker-end', markerEnd)
        .style('stroke-linecap', 'round');
      
      // 添加额外的短线段，确保完全连接到下一个节点
      svg.append('line')
        .attr('x1', nextX - nodeRadius - 2)
        .attr('y1', y)
        .attr('x2', nextX - nodeRadius + 1)
        .attr('y2', y)
        .attr('stroke', lineColor)
        .attr('stroke-width', 2 * scale)
        .style('stroke-linecap', 'round');
    }
  });
}; 