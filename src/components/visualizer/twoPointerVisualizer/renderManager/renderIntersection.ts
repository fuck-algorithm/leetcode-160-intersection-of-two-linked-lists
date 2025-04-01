import { Selection } from 'd3';
import { ListNode } from '../../../../types';
import { renderIntersectionPart, renderIntersectionConnectors } from '../../IntersectionRenderer';
import { logPointerPositions } from './logPointerPositions';
import { NodeCalculationResult } from '../nodeUtils';

/**
 * 渲染相交部分及其连接线
 */
export const renderIntersection = (
  svg: Selection<SVGSVGElement, unknown, null, undefined>,
  nodeInfo: NodeCalculationResult,
  currentNodeA: ListNode | null,
  currentNodeB: ListNode | null,
  layoutParams: {
    topRowY: number;
    bottomRowY: number;
    intersectionRowY: number;
    leftOffset: number;
    nodeRadius: number;
    nodeSpacing: number;
    fontSize: number;
    scale: number;
  }
) => {
  if (!nodeInfo.hasIntersection) return;
  
  // 添加调试日志，仅在开发模式下启用
  if (process.env.NODE_ENV === 'development' && (currentNodeA || currentNodeB)) {
    logPointerPositions(currentNodeA, currentNodeB);
  }
  
  // 渲染相交部分
  renderIntersectionPart(
    svg, 
    nodeInfo.intersectionNodes, 
    currentNodeA, 
    currentNodeB, 
    nodeInfo.startX, 
    layoutParams.intersectionRowY, 
    layoutParams.nodeRadius, 
    layoutParams.nodeSpacing, 
    layoutParams.fontSize, 
    layoutParams.scale
  );
  
  // 渲染从链表A和链表B到相交部分的连接线
  renderIntersectionConnectors(
    svg, 
    nodeInfo.preIntersectionNodesA, 
    nodeInfo.preIntersectionNodesB, 
    nodeInfo.startX, 
    layoutParams.intersectionRowY, 
    layoutParams.leftOffset, 
    layoutParams.topRowY, 
    layoutParams.bottomRowY, 
    layoutParams.nodeRadius, 
    layoutParams.nodeSpacing, 
    layoutParams.fontSize, 
    layoutParams.scale
  );
}; 