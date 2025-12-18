import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { ListNode, LinkedListData } from '../../types';

interface TwoRowVisualizerProps {
  listA: LinkedListData;
  listB: LinkedListData;
  currentNodeA: ListNode | null;
  currentNodeB: ListNode | null;
  intersectionNode: ListNode | null;
  message: string;
  step: number;
  pointerAJumped?: boolean;
  pointerBJumped?: boolean;
}

/**
 * 双行对齐可视化组件
 * 
 * 算法原理：
 * - pA: headA → ... → null → headB → ... → null
 * - pB: headB → ... → null → headA → ... → null
 * 
 * 两个指针走的总路程相同 (lenA + lenB)，所以会在相交点相遇
 */
const TwoRowVisualizer: React.FC<TwoRowVisualizerProps> = ({
  listA,
  listB,
  currentNodeA,
  currentNodeB,
  intersectionNode,
  message,
  step,
  pointerAJumped = false,
  pointerBJumped = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    d3.select(containerRef.current).selectAll('*').remove();

    const lenA = listA.nodes.length;
    const lenB = listB.nodes.length;

    if (lenA === 0 && lenB === 0) {
      renderEmptyState(containerRef.current);
      return;
    }

    // 总列数 = lenA + 1(null) + lenB + 1(null) = lenA + lenB + 2
    const totalColumns = lenA + lenB + 2;

    const containerWidth = containerRef.current.clientWidth || 900;
    const containerHeight = containerRef.current.clientHeight || 350;

    // 布局计算
    const padding = { left: 50, right: 30, top: 70, bottom: 50 };
    const availableWidth = containerWidth - padding.left - padding.right;
    
    // 动态计算节点大小
    const maxRadius = 22;
    const minRadius = 10;
    const nodeRadius = Math.max(minRadius, Math.min(maxRadius, availableWidth / (totalColumns * 3)));
    const nodeSpacing = availableWidth / (totalColumns - 1);

    const svgWidth = containerWidth;
    const svgHeight = containerHeight;
    const rowGap = Math.min(120, (svgHeight - padding.top - padding.bottom) / 2);
    const topRowY = padding.top + 40;
    const bottomRowY = topRowY + rowGap;

    // 创建SVG
    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    addDefs(svg);

    // 收集相交节点
    const intersectionSet = new Set<ListNode>();
    if (intersectionNode) {
      let node: ListNode | null = intersectionNode;
      while (node) {
        intersectionSet.add(node);
        node = node.next;
      }
    }

    // 计算当前指针位置（在各自路径中的索引）
    const pointerAPos = calculatePointerPosition(currentNodeA, listA, listB, 'A', pointerAJumped);
    const pointerBPos = calculatePointerPosition(currentNodeB, listB, listA, 'B', pointerBJumped);

    // 渲染信息面板
    renderInfoPanel(svg, message, step, svgWidth);

    // 渲染统计信息面板
    renderStatsPanel(svg, {
      lenA,
      lenB,
      pointerAPos,
      pointerBPos,
      hasIntersection: !!intersectionNode,
      svgWidth,
      topRowY,
      bottomRowY
    });

    // 渲染图例
    renderLegend(svg, svgWidth, svgHeight, nodeRadius);

    // 渲染区域分隔标签
    renderRegionLabels(svg, {
      lenA,
      lenB,
      startX: padding.left,
      nodeSpacing,
      topRowY,
      bottomRowY,
      nodeRadius
    });

    // 渲染第一行：A链表 → null → B链表 → null (pA的路径)
    renderRow(svg, {
      nodes: listA.nodes,
      secondNodes: listB.nodes,
      y: topRowY,
      startX: padding.left,
      nodeRadius,
      nodeSpacing,
      rowLabel: 'pA',
      labelColor: '#3498db',
      pointerPos: pointerAPos,
      intersectionSet,
      lenA,
      lenB
    });

    // 渲染第二行：B链表 → null → A链表 → null (pB的路径)
    renderRow(svg, {
      nodes: listB.nodes,
      secondNodes: listA.nodes,
      y: bottomRowY,
      startX: padding.left,
      nodeRadius,
      nodeSpacing,
      rowLabel: 'pB',
      labelColor: '#9b59b6',
      pointerPos: pointerBPos,
      intersectionSet,
      lenA: lenB,  // 注意这里交换了
      lenB: lenA
    });

    // 如果两个指针指向同一个节点，显示相遇效果
    // 注意：由于两个链表的非相交部分长度可能不同，两个指针的位置可能不同
    // 但只要它们指向同一个节点，就应该显示相遇效果
    if (currentNodeA && currentNodeB && currentNodeA === currentNodeB && pointerAPos !== -1 && pointerBPos !== -1) {
      const xA = padding.left + pointerAPos * nodeSpacing;
      const xB = padding.left + pointerBPos * nodeSpacing;
      renderIntersectionEffect(svg, xA, xB, topRowY, bottomRowY, nodeRadius);
    }

  }, [listA, listB, currentNodeA, currentNodeB, intersectionNode, message, step, pointerAJumped, pointerBJumped]);

  return (
    <div className="d3-container-wrapper">
      <div 
        className="d3-visualization-container" 
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

/**
 * 计算指针在路径中的位置
 * 路径: 主链表 → null → 次链表 → null
 * 
 * 关键：需要追踪指针实际走过的路径，而不是简单地查找节点位置
 * 因为相交节点同时存在于两个链表中，需要根据指针的遍历状态来确定位置
 */
function calculatePointerPosition(
  currentNode: ListNode | null,
  primaryList: LinkedListData,
  secondaryList: LinkedListData,
  pointerId: 'A' | 'B',
  hasJumped: boolean = false
): number {
  if (currentNode === null) {
    // null 可能是第一个 null（主链表末尾）或第二个 null（次链表末尾）
    if (hasJumped) {
      // 已经跳转过，这是次链表末尾的 null
      return primaryList.nodes.length + 1 + secondaryList.nodes.length;
    } else {
      // 还没跳转，这是主链表末尾的 null
      return primaryList.nodes.length;
    }
  }

  // 如果指针已经跳转到次链表
  if (hasJumped) {
    // 在次链表中查找
    const secondaryIndex = secondaryList.nodes.findIndex(n => n === currentNode);
    if (secondaryIndex !== -1) {
      // 位置 = 主链表长度 + 1(null) + 次链表中的位置
      return primaryList.nodes.length + 1 + secondaryIndex;
    }
    // 如果在次链表中找不到，可能是数据不一致，返回 -1
    return -1;
  }

  // 指针还没跳转，在主链表中查找
  const primaryIndex = primaryList.nodes.findIndex(n => n === currentNode);
  if (primaryIndex !== -1) {
    return primaryIndex;
  }

  return -1;
}

interface RenderRowParams {
  nodes: ListNode[];
  secondNodes: ListNode[];
  y: number;
  startX: number;
  nodeRadius: number;
  nodeSpacing: number;
  rowLabel: string;
  labelColor: string;
  pointerPos: number;
  intersectionSet: Set<ListNode>;
  lenA: number;
  lenB: number;
}

/**
 * 渲染一行路径
 */
function renderRow(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  params: RenderRowParams
) {
  const { nodes, secondNodes, y, startX, nodeRadius, nodeSpacing, 
          rowLabel, labelColor, pointerPos, intersectionSet } = params;
  
  const fontSize = Math.max(10, nodeRadius * 0.6);
  let colIndex = 0;

  // 渲染行标签
  svg.append('text')
    .attr('x', 10)
    .attr('y', y)
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'middle')
    .attr('fill', labelColor)
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .text(`${rowLabel}:`);

  // 渲染主链表节点
  nodes.forEach((node, i) => {
    const x = startX + colIndex * nodeSpacing;
    const isIntersection = intersectionSet.has(node);
    const isPointerHere = colIndex === pointerPos;
    
    renderNode(svg, x, y, nodeRadius, node.val, isIntersection, 
               rowLabel === 'pA' ? 'A' : 'B', fontSize);
    
    if (isPointerHere) {
      renderPointer(svg, x, y, nodeRadius, rowLabel, labelColor);
    }
    
    // 连接线
    if (i < nodes.length - 1) {
      renderArrow(svg, x + nodeRadius, y, startX + (colIndex + 1) * nodeSpacing - nodeRadius, y,
                  rowLabel === 'pA' ? '#3498db' : '#9b59b6');
    }
    
    colIndex++;
  });

  // 渲染第一个 null（主链表末尾）
  const null1X = startX + colIndex * nodeSpacing;
  renderNullNode(svg, null1X, y, nodeRadius, fontSize);
  if (colIndex === pointerPos) {
    renderPointer(svg, null1X, y, nodeRadius, rowLabel, labelColor);
  }
  // 从最后一个节点到 null 的连接线
  if (nodes.length > 0) {
    renderArrow(svg, startX + (colIndex - 1) * nodeSpacing + nodeRadius, y, 
                null1X - nodeRadius * 0.7, y, '#adb5bd');
  }
  colIndex++;

  // 渲染次链表节点
  secondNodes.forEach((node, i) => {
    const x = startX + colIndex * nodeSpacing;
    const isIntersection = intersectionSet.has(node);
    const isPointerHere = colIndex === pointerPos;
    
    // 次链表用另一种颜色
    renderNode(svg, x, y, nodeRadius, node.val, isIntersection,
               rowLabel === 'pA' ? 'B' : 'A', fontSize);
    
    if (isPointerHere) {
      renderPointer(svg, x, y, nodeRadius, rowLabel, labelColor);
    }
    
    // 连接线
    if (i === 0) {
      // 从 null 到次链表第一个节点（虚线表示跳转）
      renderArrow(svg, null1X + nodeRadius * 0.7, y, x - nodeRadius, y, '#adb5bd', true);
    } else {
      renderArrow(svg, startX + (colIndex - 1) * nodeSpacing + nodeRadius, y, x - nodeRadius, y,
                  rowLabel === 'pA' ? '#9b59b6' : '#3498db');
    }
    
    colIndex++;
  });

  // 渲染第二个 null（次链表末尾）
  const null2X = startX + colIndex * nodeSpacing;
  renderNullNode(svg, null2X, y, nodeRadius, fontSize);
  if (colIndex === pointerPos) {
    renderPointer(svg, null2X, y, nodeRadius, rowLabel, labelColor);
  }
  // 从最后一个节点到 null 的连接线
  if (secondNodes.length > 0) {
    renderArrow(svg, startX + (colIndex - 1) * nodeSpacing + nodeRadius, y,
                null2X - nodeRadius * 0.7, y, '#adb5bd');
  }
}

function renderNode(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number, y: number, radius: number, value: number,
  isIntersection: boolean, sourceList: 'A' | 'B', fontSize: number
) {
  const fillColor = isIntersection
    ? 'url(#intersection-gradient)'
    : sourceList === 'A'
      ? 'url(#node-a-gradient)'
      : 'url(#node-b-gradient)';

  svg.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', radius)
    .attr('fill', fillColor)
    .attr('stroke', isIntersection ? '#c0392b' : 'none')
    .attr('stroke-width', isIntersection ? 2 : 0);

  svg.append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', 'white')
    .attr('font-size', `${fontSize}px`)
    .attr('font-weight', 'bold')
    .text(value);
}

function renderNullNode(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number, y: number, radius: number, fontSize: number
) {
  svg.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', radius * 0.7)
    .attr('fill', '#f8f9fa')
    .attr('stroke', '#adb5bd')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '3,3');

  svg.append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', '#6c757d')
    .attr('font-size', `${fontSize * 0.8}px`)
    .attr('font-style', 'italic')
    .text('∅');
}

function renderArrow(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x1: number, y1: number, x2: number, y2: number,
  color: string, dashed: boolean = false
) {
  svg.append('line')
    .attr('x1', x1 + 3)
    .attr('y1', y1)
    .attr('x2', x2 - 3)
    .attr('y2', y2)
    .attr('stroke', color)
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', dashed ? '4,3' : 'none')
    .attr('marker-end', 'url(#arrow-marker)');
}

function renderPointer(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number, y: number, nodeRadius: number,
  label: string, color: string
) {
  const pointerRadius = Math.max(10, nodeRadius * 0.5);
  const offset = nodeRadius + pointerRadius + 12;
  const pointerY = label === 'pA' ? y - offset : y + offset;

  // 指针圆圈
  svg.append('circle')
    .attr('cx', x)
    .attr('cy', pointerY)
    .attr('r', pointerRadius)
    .attr('fill', color)
    .attr('stroke', 'white')
    .attr('stroke-width', 2);

  // 指针标签
  svg.append('text')
    .attr('x', x)
    .attr('y', pointerY + 1)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', 'white')
    .attr('font-size', `${pointerRadius}px`)
    .attr('font-weight', 'bold')
    .text(label);

  // 连接线
  const lineStart = label === 'pA' ? pointerY + pointerRadius : pointerY - pointerRadius;
  const lineEnd = label === 'pA' ? y - nodeRadius - 2 : y + nodeRadius + 2;

  svg.append('line')
    .attr('x1', x)
    .attr('y1', lineStart)
    .attr('x2', x)
    .attr('y2', lineEnd)
    .attr('stroke', color)
    .attr('stroke-width', 2);

  // 箭头
  const arrowSize = 5;
  const arrowY = lineEnd;
  svg.append('path')
    .attr('d', label === 'pA'
      ? `M${x - arrowSize},${arrowY - arrowSize} L${x},${arrowY} L${x + arrowSize},${arrowY - arrowSize}`
      : `M${x - arrowSize},${arrowY + arrowSize} L${x},${arrowY} L${x + arrowSize},${arrowY + arrowSize}`)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 2);

  // 高亮环
  svg.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', nodeRadius + 4)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 2.5)
    .attr('stroke-opacity', 0.5);
}

function renderIntersectionEffect(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  xTop: number, xBottom: number, topY: number, bottomY: number, nodeRadius: number
) {
  // 连接两行的高亮线（斜线连接两个不同位置的节点）
  svg.append('line')
    .attr('x1', xTop)
    .attr('y1', topY + nodeRadius + 15)
    .attr('x2', xBottom)
    .attr('y2', bottomY - nodeRadius - 15)
    .attr('stroke', '#f39c12')
    .attr('stroke-width', 3)
    .attr('stroke-dasharray', '6,4')
    .attr('opacity', 0.8);

  // 相遇标记 - 放在连线中间
  const midX = (xTop + xBottom) / 2;
  const midY = (topY + bottomY) / 2;
  svg.append('text')
    .attr('x', midX + 15)
    .attr('y', midY)
    .attr('fill', '#e67e22')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .text('相遇!');
}

function renderInfoPanel(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  message: string, step: number, width: number
) {
  svg.append('rect')
    .attr('x', 10)
    .attr('y', 8)
    .attr('width', Math.min(width - 20, 700))
    .attr('height', 32)
    .attr('rx', 5)
    .attr('fill', '#f8f9fa')
    .attr('stroke', '#dee2e6');

  svg.append('text')
    .attr('x', 20)
    .attr('y', 28)
    .attr('fill', '#495057')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .text(`步骤 ${step}`);

  svg.append('text')
    .attr('x', 75)
    .attr('y', 28)
    .attr('fill', '#212529')
    .attr('font-size', '12px')
    .text(message || '');
}

function addDefs(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
  const defs = svg.append('defs');

  // 渐变
  const gradientA = defs.append('linearGradient').attr('id', 'node-a-gradient')
    .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
  gradientA.append('stop').attr('offset', '0%').attr('stop-color', '#3498db');
  gradientA.append('stop').attr('offset', '100%').attr('stop-color', '#2980b9');

  const gradientB = defs.append('linearGradient').attr('id', 'node-b-gradient')
    .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
  gradientB.append('stop').attr('offset', '0%').attr('stop-color', '#9b59b6');
  gradientB.append('stop').attr('offset', '100%').attr('stop-color', '#8e44ad');

  const gradientInt = defs.append('linearGradient').attr('id', 'intersection-gradient')
    .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
  gradientInt.append('stop').attr('offset', '0%').attr('stop-color', '#e74c3c');
  gradientInt.append('stop').attr('offset', '100%').attr('stop-color', '#c0392b');

  // 箭头
  defs.append('marker')
    .attr('id', 'arrow-marker')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 9).attr('refY', 5)
    .attr('markerWidth', 5).attr('markerHeight', 5)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 z')
    .attr('fill', '#6c757d');
}

function renderEmptyState(container: HTMLDivElement) {
  const svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', '0 0 400 200');

  svg.append('text')
    .attr('x', 200).attr('y', 100)
    .attr('text-anchor', 'middle')
    .attr('fill', '#6c757d')
    .attr('font-size', '16px')
    .text('请先创建链表');
}

/**
 * 渲染统计信息面板
 */
interface StatsPanelParams {
  lenA: number;
  lenB: number;
  pointerAPos: number;
  pointerBPos: number;
  hasIntersection: boolean;
  svgWidth: number;
  topRowY: number;
  bottomRowY: number;
}

function renderStatsPanel(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  params: StatsPanelParams
) {
  const { lenA, lenB, pointerAPos, pointerBPos, hasIntersection, svgWidth } = params;
  
  // 计算指针走过的步数
  const stepsA = pointerAPos >= 0 ? pointerAPos : 0;
  const stepsB = pointerBPos >= 0 ? pointerBPos : 0;
  
  // 总路程
  const totalPath = lenA + lenB;
  
  // 在右上角显示统计信息
  const statsX = svgWidth - 180;
  const statsY = 12;
  
  // 背景
  svg.append('rect')
    .attr('x', statsX - 10)
    .attr('y', statsY - 4)
    .attr('width', 175)
    .attr('height', 70)
    .attr('rx', 5)
    .attr('fill', 'rgba(248, 249, 250, 0.95)')
    .attr('stroke', '#dee2e6');
  
  // 标题
  svg.append('text')
    .attr('x', statsX)
    .attr('y', statsY + 10)
    .attr('fill', '#495057')
    .attr('font-size', '11px')
    .attr('font-weight', 'bold')
    .text('📊 算法统计');
  
  // 链表长度
  svg.append('text')
    .attr('x', statsX)
    .attr('y', statsY + 26)
    .attr('fill', '#3498db')
    .attr('font-size', '10px')
    .text(`链表A: ${lenA}节点`);
  
  svg.append('text')
    .attr('x', statsX + 80)
    .attr('y', statsY + 26)
    .attr('fill', '#9b59b6')
    .attr('font-size', '10px')
    .text(`链表B: ${lenB}节点`);
  
  // 指针步数
  svg.append('text')
    .attr('x', statsX)
    .attr('y', statsY + 42)
    .attr('fill', '#3498db')
    .attr('font-size', '10px')
    .text(`pA已走: ${stepsA}步`);
  
  svg.append('text')
    .attr('x', statsX + 80)
    .attr('y', statsY + 42)
    .attr('fill', '#9b59b6')
    .attr('font-size', '10px')
    .text(`pB已走: ${stepsB}步`);
  
  // 总路程和相交状态
  svg.append('text')
    .attr('x', statsX)
    .attr('y', statsY + 58)
    .attr('fill', '#6c757d')
    .attr('font-size', '10px')
    .text(`总路程: ${totalPath}步`);
  
  svg.append('text')
    .attr('x', statsX + 80)
    .attr('y', statsY + 58)
    .attr('fill', hasIntersection ? '#27ae60' : '#e74c3c')
    .attr('font-size', '10px')
    .text(hasIntersection ? '✓ 有相交' : '✗ 无相交');
}

/**
 * 渲染区域分隔标签
 */
interface RegionLabelsParams {
  lenA: number;
  lenB: number;
  startX: number;
  nodeSpacing: number;
  topRowY: number;
  bottomRowY: number;
  nodeRadius: number;
}

function renderRegionLabels(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  params: RegionLabelsParams
) {
  const { lenA, lenB, startX, nodeSpacing, topRowY, bottomRowY, nodeRadius } = params;
  
  // 第一行区域标签
  // 链表A区域
  if (lenA > 0) {
    const aRegionStart = startX;
    const aRegionEnd = startX + (lenA - 1) * nodeSpacing;
    const aRegionMid = (aRegionStart + aRegionEnd) / 2;
    
    svg.append('text')
      .attr('x', aRegionMid)
      .attr('y', topRowY - nodeRadius - 35)
      .attr('text-anchor', 'middle')
      .attr('fill', '#3498db')
      .attr('font-size', '9px')
      .attr('opacity', 0.8)
      .text('← 链表A →');
  }
  
  // 链表B区域（在第一行的后半部分）
  if (lenB > 0) {
    const bRegionStart = startX + (lenA + 1) * nodeSpacing;
    const bRegionEnd = startX + (lenA + lenB) * nodeSpacing;
    const bRegionMid = (bRegionStart + bRegionEnd) / 2;
    
    svg.append('text')
      .attr('x', bRegionMid)
      .attr('y', topRowY - nodeRadius - 35)
      .attr('text-anchor', 'middle')
      .attr('fill', '#9b59b6')
      .attr('font-size', '9px')
      .attr('opacity', 0.8)
      .text('← 链表B →');
  }
  
  // 第二行区域标签
  // 链表B区域
  if (lenB > 0) {
    const bRegionStart = startX;
    const bRegionEnd = startX + (lenB - 1) * nodeSpacing;
    const bRegionMid = (bRegionStart + bRegionEnd) / 2;
    
    svg.append('text')
      .attr('x', bRegionMid)
      .attr('y', bottomRowY + nodeRadius + 45)
      .attr('text-anchor', 'middle')
      .attr('fill', '#9b59b6')
      .attr('font-size', '9px')
      .attr('opacity', 0.8)
      .text('← 链表B →');
  }
  
  // 链表A区域（在第二行的后半部分）
  if (lenA > 0) {
    const aRegionStart = startX + (lenB + 1) * nodeSpacing;
    const aRegionEnd = startX + (lenB + lenA) * nodeSpacing;
    const aRegionMid = (aRegionStart + aRegionEnd) / 2;
    
    svg.append('text')
      .attr('x', aRegionMid)
      .attr('y', bottomRowY + nodeRadius + 45)
      .attr('text-anchor', 'middle')
      .attr('fill', '#3498db')
      .attr('font-size', '9px')
      .attr('opacity', 0.8)
      .text('← 链表A →');
  }
  
  // 跳转标记
  const jumpX = startX + lenA * nodeSpacing;
  svg.append('text')
    .attr('x', jumpX)
    .attr('y', topRowY - nodeRadius - 20)
    .attr('text-anchor', 'middle')
    .attr('fill', '#f39c12')
    .attr('font-size', '8px')
    .text('跳转');
  
  const jumpX2 = startX + lenB * nodeSpacing;
  svg.append('text')
    .attr('x', jumpX2)
    .attr('y', bottomRowY + nodeRadius + 30)
    .attr('text-anchor', 'middle')
    .attr('fill', '#f39c12')
    .attr('font-size', '8px')
    .text('跳转');
}

/**
 * 渲染图例
 */
function renderLegend(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  svgWidth: number,
  svgHeight: number,
  nodeRadius: number
) {
  const legendX = 15;
  const legendY = svgHeight - 55;
  const itemSpacing = 85;
  const circleRadius = 6;
  
  // 背景
  svg.append('rect')
    .attr('x', legendX - 5)
    .attr('y', legendY - 12)
    .attr('width', 360)
    .attr('height', 50)
    .attr('rx', 5)
    .attr('fill', 'rgba(248, 249, 250, 0.9)')
    .attr('stroke', '#dee2e6');
  
  // 标题
  svg.append('text')
    .attr('x', legendX)
    .attr('y', legendY)
    .attr('fill', '#495057')
    .attr('font-size', '10px')
    .attr('font-weight', 'bold')
    .text('图例:');
  
  // 链表A节点
  svg.append('circle')
    .attr('cx', legendX + 40)
    .attr('cy', legendY - 3)
    .attr('r', circleRadius)
    .attr('fill', 'url(#node-a-gradient)');
  svg.append('text')
    .attr('x', legendX + 50)
    .attr('y', legendY)
    .attr('fill', '#3498db')
    .attr('font-size', '9px')
    .text('链表A');
  
  // 链表B节点
  svg.append('circle')
    .attr('cx', legendX + 40 + itemSpacing)
    .attr('cy', legendY - 3)
    .attr('r', circleRadius)
    .attr('fill', 'url(#node-b-gradient)');
  svg.append('text')
    .attr('x', legendX + 50 + itemSpacing)
    .attr('y', legendY)
    .attr('fill', '#9b59b6')
    .attr('font-size', '9px')
    .text('链表B');
  
  // 相交节点
  svg.append('circle')
    .attr('cx', legendX + 40 + itemSpacing * 2)
    .attr('cy', legendY - 3)
    .attr('r', circleRadius)
    .attr('fill', 'url(#intersection-gradient)');
  svg.append('text')
    .attr('x', legendX + 50 + itemSpacing * 2)
    .attr('y', legendY)
    .attr('fill', '#e74c3c')
    .attr('font-size', '9px')
    .text('相交节点');
  
  // null节点
  svg.append('circle')
    .attr('cx', legendX + 40 + itemSpacing * 3)
    .attr('cy', legendY - 3)
    .attr('r', circleRadius * 0.8)
    .attr('fill', '#f8f9fa')
    .attr('stroke', '#adb5bd')
    .attr('stroke-dasharray', '2,2');
  svg.append('text')
    .attr('x', legendX + 50 + itemSpacing * 3)
    .attr('y', legendY)
    .attr('fill', '#6c757d')
    .attr('font-size', '9px')
    .text('null');
  
  // 第二行 - 算法说明
  svg.append('text')
    .attr('x', legendX)
    .attr('y', legendY + 20)
    .attr('fill', '#6c757d')
    .attr('font-size', '9px')
    .text('💡 算法原理: pA走完A后跳到B头，pB走完B后跳到A头，两者走相同总路程后在相交点相遇');
}

export default TwoRowVisualizer;
