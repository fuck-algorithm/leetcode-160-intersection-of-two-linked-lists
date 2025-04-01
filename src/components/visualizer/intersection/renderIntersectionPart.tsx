import * as d3 from 'd3';
import { ListNode } from '../../../types';
import { 
  addPointerAHighlight, 
  addPointerBHighlight, 
  addIntersectionHighlight,
  addPointerMarker
} from '../../../utils/d3utils/pointers';

/**
 * 渲染两个链表的相交部分
 */
export const renderIntersectionPart = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  intersectionNodes: ListNode[],
  currentNodeA: ListNode | null,
  currentNodeB: ListNode | null,
  startX: number,
  intersectionRowY: number,
  nodeRadius: number,
  nodeSpacing: number,
  fontSize: number,
  scale: number = 1
) => {
  if (!intersectionNodes.length) return;

  // 绘制相交部分的链表
  intersectionNodes.forEach((node, i) => {
    const x = startX + i * nodeSpacing;
    const y = intersectionRowY;
    
    const isCurrentA = node === currentNodeA;
    const isCurrentB = node === currentNodeB;
    
    // 如果不是当前节点A或B，绘制普通节点
    if (!isCurrentA && !isCurrentB) {
      // 使用渐变填充，增强视觉效果
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', nodeRadius)
        .attr('fill', 'url(#intersection-gradient)')
        .attr('stroke', '#c0392b') // 添加边框增强辨识度
        .attr('stroke-width', 1.5);
      
      // 为所有相交部分添加节点值
      svg.append('text')
        .attr('class', `node-value-${Math.round(x)}-${Math.round(y)}`)
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'white')
        .attr('font-size', `${fontSize}px`)
        .attr('font-weight', 'bold')
        .text(node.val);
    }
    
    // 绘制连接线，加粗以增强可见性
    if (i < intersectionNodes.length - 1) {
      // 到下一个节点的连接
      const nextX = startX + (i + 1) * nodeSpacing;
      
      // 调整控制点位置，使曲线更平滑
      const controlX1 = x + nodeRadius + (nextX - x - 2 * nodeRadius) * 0.3;
      const controlX2 = x + nodeRadius + (nextX - x - 2 * nodeRadius) * 0.7;
      
      svg.append('path')
        .attr('d', `M${x + nodeRadius},${y} C${controlX1},${y} ${controlX2},${y} ${nextX - nodeRadius - 2},${y}`)
        .attr('stroke', '#e74c3c')
        .attr('stroke-width', 3) // 加粗线条
        .attr('fill', 'none')
        .attr('marker-end', 'url(#arrow-marker-intersection)')
        .style('stroke-linecap', 'round');
      
      // 添加额外的短线段，确保完全连接到下一个节点
      svg.append('line')
        .attr('x1', nextX - nodeRadius - 2)
        .attr('y1', y)
        .attr('x2', nextX - nodeRadius + 1)
        .attr('y2', y)
        .attr('stroke', '#e74c3c')
        .attr('stroke-width', 3) // 加粗线条
        .style('stroke-linecap', 'round');
    }
    
    // 根据当前指针添加对应的高亮效果
    if (isCurrentA && isCurrentB) {
      // 两个指针都在这个节点，使用交点高亮效果
      addIntersectionHighlight(svg, x, y, nodeRadius, scale, node.val, fontSize);
    } else if (isCurrentA) {
      // 只有指针A在这个节点
      addPointerAHighlight(svg, x, y, nodeRadius, scale, node.val, fontSize);
    } else if (isCurrentB) {
      // 只有指针B在这个节点
      addPointerBHighlight(svg, x, y, nodeRadius, scale, node.val, fontSize);
    }
  });
  
  // 添加指针标记，并放置在更明显的位置
  if (currentNodeA && intersectionNodes.includes(currentNodeA)) {
    const index = intersectionNodes.findIndex(node => node === currentNodeA);
    const x = startX + index * nodeSpacing;
    const y = intersectionRowY;
    
    // 调整指针A的位置，避免与节点重叠
    addPointerMarker(svg, x, y, nodeRadius, '#2980b9', 'pA', scale);
    
    // 添加一个额外的指示线，指向当前指针A的节点
    svg.append('path')
      .attr('d', `M${x - nodeRadius - 15},${y - nodeRadius - 15} L${x - nodeRadius - 5},${y - nodeRadius - 5}`)
      .attr('stroke', '#2980b9')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow-marker)')
      .style('stroke-linecap', 'round');
  }
  
  if (currentNodeB && intersectionNodes.includes(currentNodeB)) {
    const index = intersectionNodes.findIndex(node => node === currentNodeB);
    const x = startX + index * nodeSpacing;
    const y = intersectionRowY;
    
    // 调整指针B的位置，避免与节点重叠
    addPointerMarker(svg, x, y, nodeRadius, '#8e44ad', 'pB', scale);
    
    // 添加一个额外的指示线，指向当前指针B的节点
    svg.append('path')
      .attr('d', `M${x + nodeRadius + 15},${y - nodeRadius - 15} L${x + nodeRadius + 5},${y - nodeRadius - 5}`)
      .attr('stroke', '#8e44ad')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow-marker)')
      .style('stroke-linecap', 'round');
  }
}; 