import React from 'react';
import * as d3 from 'd3';
import { ListNode } from '../../types';
import { drawConnector } from '../../utils/d3utils/paths';
import { 
  addPointerAHighlight, 
  addPointerBHighlight, 
  addIntersectionHighlight,
  addPointerMarker
} from '../../utils/d3utils/pointers';
import { drawLinkedList, isNodeInIntersection } from './LinkedListRenderer';

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
      // 统一使用渐变填充样式，与链表A和B保持一致
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', nodeRadius)
        .attr('fill', 'url(#intersection-gradient)')  // 使用渐变填充
        .attr('stroke', 'none');  // 与其他节点一致，不使用边框
      
      // 为所有相交部分添加节点值
      svg.append('text')
        .attr('class', `node-value-${Math.round(x)}-${Math.round(y)}`)
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'white')  // 与A和B的文本颜色一致
        .attr('font-size', `${fontSize}px`)
        .attr('font-weight', 'bold')
        .text(node.val);
    }
    
    // 绘制连接线，使用相同的样式
    if (i < intersectionNodes.length - 1) {
      // 到下一个节点的连接
      const nextX = startX + (i + 1) * nodeSpacing;
      
      // 统一使用贝塞尔曲线连接，与链表A和B保持一致
      // 计算控制点
      const controlX1 = x + nodeRadius + (nextX - x - 2 * nodeRadius) * 0.3;
      const controlX2 = x + nodeRadius + (nextX - x - 2 * nodeRadius) * 0.7;
      
      svg.append('path')
        .attr('d', `M${x + nodeRadius},${y} C${controlX1},${y} ${controlX2},${y} ${nextX - nodeRadius - 2},${y}`)
        .attr('stroke', '#e74c3c')  // 保持红色来区分相交部分
        .attr('stroke-width', 2)
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
        .attr('stroke-width', 2)
        .style('stroke-linecap', 'round');
    }
    
    // 根据当前指针添加对应的高亮效果
    if (isCurrentA && isCurrentB) {
      // 两个指针都在这个节点，使用交点高亮效果
      addIntersectionHighlight(svg, x, y, nodeRadius, scale, node.val);
    } else if (isCurrentA) {
      // 只有指针A在这个节点
      addPointerAHighlight(svg, x, y, nodeRadius, scale, node.val);
    } else if (isCurrentB) {
      // 只有指针B在这个节点
      addPointerBHighlight(svg, x, y, nodeRadius, scale, node.val);
    }
  });
  
  // 添加指针标记
  if (currentNodeA && intersectionNodes.includes(currentNodeA)) {
    const index = intersectionNodes.findIndex(node => node === currentNodeA);
    const x = startX + index * nodeSpacing;
    const y = intersectionRowY;
    addPointerMarker(svg, x, y, nodeRadius, '#2980b9', 'pA', scale);
  }
  
  if (currentNodeB && intersectionNodes.includes(currentNodeB)) {
    const index = intersectionNodes.findIndex(node => node === currentNodeB);
    const x = startX + index * nodeSpacing;
    const y = intersectionRowY;
    addPointerMarker(svg, x, y, nodeRadius, '#8e44ad', 'pB', scale);
  }
};

/**
 * 渲染从链表A和链表B非相交部分到相交部分的连接线
 */
export const renderIntersectionConnectors = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  preIntersectionNodesA: ListNode[],
  preIntersectionNodesB: ListNode[],
  intersectionStartX: number,
  intersectionStartY: number,
  leftOffset: number,
  topRowY: number,
  bottomRowY: number,
  nodeRadius: number,
  nodeSpacing: number,
  fontSize: number,
  scale: number = 1
) => {
  // 如果没有相交节点，就不需要连接器
  if (intersectionStartX <= 0) return;
  
  // 计算链表A的最后一个非相交节点位置
  const lastNodeAX = preIntersectionNodesA.length > 0 
    ? leftOffset + (preIntersectionNodesA.length - 1) * nodeSpacing 
    : leftOffset;
  const lastNodeAY = topRowY;
  
  // 计算链表B的最后一个非相交节点位置
  const lastNodeBX = preIntersectionNodesB.length > 0 
    ? leftOffset + (preIntersectionNodesB.length - 1) * nodeSpacing 
    : leftOffset;
  const lastNodeBY = bottomRowY;
  
  // 从链表A连接到相交部分 - 使用相同的贝塞尔曲线样式
  if (preIntersectionNodesA.length > 0) {
    const controlPointAX1 = lastNodeAX + nodeRadius + (intersectionStartX - lastNodeAX - nodeRadius) * 0.3;
    const controlPointAY1 = lastNodeAY;
    const controlPointAX2 = lastNodeAX + nodeRadius + (intersectionStartX - lastNodeAX - nodeRadius) * 0.7;
    const controlPointAY2 = intersectionStartY;
    
    // 绘制从链表A到相交部分的连接曲线
    svg.append('path')
      .attr('d', `M${lastNodeAX + nodeRadius},${lastNodeAY} C${controlPointAX1},${controlPointAY1} ${controlPointAX2},${controlPointAY2} ${intersectionStartX - nodeRadius - 2},${intersectionStartY}`)
      .attr('stroke', '#3498db')  // 链表A的蓝色
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrow-marker)')
      .style('stroke-linecap', 'round');
    
    // 添加额外的短线段，确保完全连接到相交部分
    svg.append('line')
      .attr('x1', intersectionStartX - nodeRadius - 2)
      .attr('y1', intersectionStartY)
      .attr('x2', intersectionStartX - nodeRadius + 1)
      .attr('y2', intersectionStartY)
      .attr('stroke', '#3498db')
      .attr('stroke-width', 2)
      .style('stroke-linecap', 'round');
  }
  
  // 从链表B连接到相交部分 - 使用相同的贝塞尔曲线样式
  if (preIntersectionNodesB.length > 0) {
    const controlPointBX1 = lastNodeBX + nodeRadius + (intersectionStartX - lastNodeBX - nodeRadius) * 0.3;
    const controlPointBY1 = lastNodeBY;
    const controlPointBX2 = lastNodeBX + nodeRadius + (intersectionStartX - lastNodeBX - nodeRadius) * 0.7;
    const controlPointBY2 = intersectionStartY;
    
    // 绘制从链表B到相交部分的连接曲线
    svg.append('path')
      .attr('d', `M${lastNodeBX + nodeRadius},${lastNodeBY} C${controlPointBX1},${controlPointBY1} ${controlPointBX2},${controlPointBY2} ${intersectionStartX - nodeRadius - 2},${intersectionStartY}`)
      .attr('stroke', '#9b59b6')  // 链表B的紫色
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrow-marker)')
      .style('stroke-linecap', 'round');
    
    // 添加额外的短线段，确保完全连接到相交部分
    svg.append('line')
      .attr('x1', intersectionStartX - nodeRadius - 2)
      .attr('y1', intersectionStartY)
      .attr('x2', intersectionStartX - nodeRadius + 1)
      .attr('y2', intersectionStartY)
      .attr('stroke', '#9b59b6')
      .attr('stroke-width', 2)
      .style('stroke-linecap', 'round');
  }
}; 