import * as d3 from 'd3';
import { ListNode } from '../../../../types';

/**
 * 为可视化添加简单的高亮效果（无扩散动画）
 */
export const applyAnimationEffects = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  currentNodeA: ListNode | null,
  currentNodeB: ListNode | null,
  nodePositions: Map<ListNode, {x: number, y: number}>,
  nodeRadius: number,
  scale: number = 1
) => {
  if (!currentNodeA && !currentNodeB) return;

  // 为指针A添加简单高亮
  if (currentNodeA) {
    const position = nodePositions.get(currentNodeA);
    if (position) {
      addSimpleHighlight(svg, position.x, position.y, nodeRadius, '#3498db', scale);
    }
  }
  
  // 为指针B添加简单高亮（如果不是同一个节点）
  if (currentNodeB && currentNodeB !== currentNodeA) {
    const position = nodePositions.get(currentNodeB);
    if (position) {
      addSimpleHighlight(svg, position.x, position.y, nodeRadius, '#9b59b6', scale);
    }
  }
  
  // 如果两个指针指向同一个节点，添加相交高亮
  if (currentNodeA && currentNodeB && currentNodeA === currentNodeB) {
    const position = nodePositions.get(currentNodeA);
    if (position) {
      addSimpleHighlight(svg, position.x, position.y, nodeRadius, '#f39c12', scale, 4);
    }
  }
};

/**
 * 添加简单的静态高亮环
 */
const addSimpleHighlight = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number,
  y: number,
  nodeRadius: number,
  color: string,
  scale: number = 1,
  strokeWidth: number = 3
) => {
  svg.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', nodeRadius * 1.3)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', strokeWidth * scale)
    .attr('stroke-opacity', 0.6);
};

/**
 * 记录节点位置，用于高亮效果
 */
export const collectNodePositions = (
  nodeInfo: any,
  leftOffset: number,
  nodeSpacing: number,
  topRowY: number,
  bottomRowY: number
): Map<ListNode, {x: number, y: number}> => {
  const positions = new Map<ListNode, {x: number, y: number}>();
  
  // 保存链表A中节点的位置
  nodeInfo.preIntersectionNodesA.forEach((node: ListNode, index: number) => {
    positions.set(node, {
      x: leftOffset + index * nodeSpacing,
      y: topRowY
    });
  });
  
  // 保存链表B中节点的位置
  nodeInfo.preIntersectionNodesB.forEach((node: ListNode, index: number) => {
    positions.set(node, {
      x: leftOffset + index * nodeSpacing,
      y: bottomRowY
    });
  });
  
  // 保存相交部分节点的位置
  const intersectionY = (topRowY + bottomRowY) / 2;
  nodeInfo.intersectionNodes.forEach((node: ListNode, index: number) => {
    positions.set(node, {
      x: nodeInfo.startX + index * nodeSpacing,
      y: intersectionY
    });
  });
  
  return positions;
};
