import * as d3 from 'd3';
import { ListNode } from '../../../../types';
import { 
  addNodeSelectedEffect,
  addPointersIntersectionEffect
} from '../../../../utils/d3utils/pointers';

/**
 * 为可视化添加动画效果
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

  // 应用当前选中节点的动画效果
  if (currentNodeA) {
    const position = nodePositions.get(currentNodeA);
    if (position) {
      // 为指针A选中的节点添加蓝色波纹动画
      addNodeSelectedEffect(
        svg, 
        position.x, 
        position.y, 
        nodeRadius, 
        '#3498db', // 蓝色 
        scale
      );
    }
  }
  
  if (currentNodeB) {
    const position = nodePositions.get(currentNodeB);
    if (position) {
      // 如果不是同一个节点，为指针B添加紫色波纹动画
      if (currentNodeB !== currentNodeA) {
        addNodeSelectedEffect(
          svg, 
          position.x, 
          position.y, 
          nodeRadius, 
          '#9b59b6', // 紫色
          scale
        );
      }
    }
  }
  
  // 如果两个指针指向同一个节点，添加相交动画特效
  if (currentNodeA && currentNodeB && currentNodeA === currentNodeB) {
    const position = nodePositions.get(currentNodeA); // 两个是同一个节点，用A或B都可以
    if (position) {
      // 添加黄色相交节点特效
      addPointersIntersectionEffect(
        svg,
        position.x,
        position.y,
        nodeRadius,
        scale
      );
    }
  }
};

/**
 * 记录节点位置，用于动画效果
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