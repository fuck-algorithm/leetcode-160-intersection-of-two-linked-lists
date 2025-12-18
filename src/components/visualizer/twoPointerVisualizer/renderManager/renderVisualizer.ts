import * as d3 from 'd3';
import { ListNode, LinkedListData } from '../../../../types';
import { calculateNodeInfo } from '../nodeUtils';
import { renderInfoPanel } from '../../InfoPanel';
import { setupSVG } from './setupSVG';
import { renderEmptyState } from './renderEmptyState';
import { renderLinkedLists } from './renderLinkedLists';
import { renderIntersection } from './renderIntersection';
import { addPointersIntersectEffect } from '../../../../utils/d3utils/pointers';
import { 
  addPointerAHighlight, 
  addPointerBHighlight, 
  addIntersectionHighlight, 
  addNodeSelectedEffect,
  addPointersIntersectionEffect
} from '../../../../utils/d3utils/pointers';
import { collectNodePositions, applyAnimationEffects } from './renderAnimations';

/**
 * 渲染可视化器
 */
export const renderVisualizer = (
  containerRef: HTMLDivElement,
  containerSize: { width: number, height: number },
  listA: LinkedListData,
  listB: LinkedListData,
  currentNodeA: ListNode | null,
  currentNodeB: ListNode | null,
  intersectionNode: ListNode | null,
  message: string = '',
  step: number = 0
) => {
  if (!containerRef) return;
  
  // 清除现有内容
  d3.select(containerRef).selectAll('*').remove();
  
  // 记录哪些指针已经被渲染，避免重复渲染
  const renderedPointers = {
    pointerA: new Set<ListNode>(),
    pointerB: new Set<ListNode>()
  };
  
  // 检查是否两个链表都是空的
  if (listA.nodes.length === 0 && listB.nodes.length === 0) {
    renderEmptyState(containerRef);
    return;
  }
  
  // 获取容器尺寸和其他布局参数
  const containerWidth = containerSize.width || 1000; // 如果没有容器宽度，默认为1000
  const containerHeight = containerSize.height || 800; // 如果没有容器高度，默认为800
  
  // 计算节点信息 - 先获取节点总数用于动态调整间距
  const totalNodesCountA = listA.nodes.length;
  const totalNodesCountB = listB.nodes.length;
  const intersectionCount = intersectionNode ? 
    listA.nodes.filter(node => node === intersectionNode || node.next === intersectionNode).length : 0;
  
  // 计算总有效节点数（两个链表的非共享部分 + 共享部分）
  const totalEffectiveNodesEstimate = 
    totalNodesCountA + totalNodesCountB - (intersectionCount > 0 ? intersectionCount : 0);
  
  // 动态计算节点半径和间距 - 确保在不同数量节点时都能合理显示
  // 为较多节点的情况减小节点尺寸和间距
  let nodeRadius = 35; // 默认节点半径
  let nodeSpacing = 120; // 默认节点间距
  
  // 如果有大量节点，动态调整尺寸以适应屏幕
  if (totalEffectiveNodesEstimate > 12) {
    // 对于大量节点，逐步缩小尺寸
    nodeRadius = Math.max(18, 35 - (totalEffectiveNodesEstimate - 12) * 0.7);
    nodeSpacing = Math.max(60, 120 - (totalEffectiveNodesEstimate - 12) * 3);
  } else if (totalEffectiveNodesEstimate < 5) {
    // 对于少量节点，可以适当增大尺寸
    nodeRadius = Math.min(45, 35 + (5 - totalEffectiveNodesEstimate) * 2);
    nodeSpacing = Math.min(150, 120 + (5 - totalEffectiveNodesEstimate) * 6);
  }
  
  // 防止无内容链表导致的布局问题
  const minNodesForLayout = 1;
  const effectiveNodesA = Math.max(minNodesForLayout, totalNodesCountA);
  const effectiveNodesB = Math.max(minNodesForLayout, totalNodesCountB);
  
  // 调整顶部和底部行的Y坐标，确保有足够的垂直空间
  const topMargin = Math.max(130, containerHeight * 0.15); // 确保有足够的顶部边距
  const verticalCenter = containerHeight * 0.45; // 将中心线略微上移
  // 根据节点数量增加垂直间距
  const verticalSpacingBase = Math.min(160, containerHeight * 0.3);
  const verticalSpacingAdjust = Math.min(40, Math.max(totalNodesCountA, totalNodesCountB) * 2);
  const verticalSpacing = verticalSpacingBase + verticalSpacingAdjust;
  
  // 调整行位置，确保不同链表长度时布局均衡
  const topRowY = topMargin + 30; // 固定上行位置，减少变动
  const bottomRowY = topRowY + verticalSpacing; // 动态下行位置
  const leftOffset = Math.max(70, nodeRadius * 2); // 左侧边距，确保足够宽
  const fontSize = Math.max(14, Math.min(26, nodeRadius * 0.8)); // 动态调整字体大小
  
  // 计算适合SVG的缩放因子
  const scale = Math.min(containerSize.width / 1200, containerSize.height / 900);
  
  // 计算节点信息
  const nodeInfo = calculateNodeInfo(
    listA,
    listB,
    intersectionNode,
    currentNodeA,
    currentNodeB,
    leftOffset,
    nodeSpacing,
    nodeRadius
  );
  
  // 计算SVG尺寸 - 确保足够宽以容纳所有节点，但不超过合理范围
  const minWidth = Math.max(800, containerWidth * 0.9);
  const maxWidth = Math.min(4000, containerWidth * 3); // 限制最大宽度防止过大
  
  // 保证足够宽，以防止截断
  const requiredWidth = leftOffset + (Math.max(
    nodeInfo.preIntersectionNodesA.length,
    nodeInfo.preIntersectionNodesB.length
  ) + nodeInfo.intersectionNodes.length) * nodeSpacing + leftOffset * 2;
  
  const viewBoxWidth = Math.min(
    maxWidth, 
    Math.max(
      minWidth,
      requiredWidth
    )
  );
  
  // 动态调整高度，确保有足够空间显示所有内容
  const minHeight = 500;
  const baseHeight = 700;
  const extraHeight = nodeInfo.hasIntersection ? 100 : 0; // 如果有相交部分，增加高度
  // 为长链表增加更多高度
  const lengthFactor = Math.max(nodeInfo.preIntersectionNodesA.length, nodeInfo.preIntersectionNodesB.length) * 5;
  const viewBoxHeight = Math.max(minHeight, baseHeight + extraHeight + lengthFactor);
  
  // 创建SVG
  const svg = setupSVG(containerRef, viewBoxWidth, viewBoxHeight);
  
  // 先渲染链表内容
  // 渲染链表 - 使用对象参数形式调用
  const renderParams = {
    svg,
    nodeInfo,
    layoutParams: {
      topRowY,
      bottomRowY,
      leftOffset,
      nodeRadius,
      nodeSpacing,
      fontSize,
      scale
    },
    currentNodeA,
    currentNodeB
  };
  
  // @ts-ignore - 绕过TS类型检查，确保调用正确的重载版本
  renderLinkedLists(renderParams);
  
  // 在渲染链表之后、添加各种特效之前，收集节点位置
  const nodePositions = collectNodePositions(
    nodeInfo,
    leftOffset,
    nodeSpacing,
    topRowY,
    bottomRowY
  );
  
  // 渲染相交部分的连接线 - 使用简洁的直角折线设计
  if (nodeInfo.hasIntersection && nodeInfo.intersectionNodes.length > 0) {
    // 获取链表A和B的最后节点位置
    const lastAIndex = nodeInfo.preIntersectionNodesA.length - 1;
    const lastBIndex = nodeInfo.preIntersectionNodesB.length - 1;
    
    const lastAX = leftOffset + (lastAIndex >= 0 ? lastAIndex * nodeSpacing : 0);
    const lastBX = leftOffset + (lastBIndex >= 0 ? lastBIndex * nodeSpacing : 0);
    
    // 第一个相交节点的位置
    const intersectionX = nodeInfo.startX;
    // 将相交部分移到两个链表的中间
    const intersectionY = (topRowY + bottomRowY) / 2;
    
    // 计算汇合点X坐标 - 在最后一个非相交节点和第一个相交节点之间
    const maxLastX = Math.max(lastAX, lastBX);
    const mergeX = maxLastX + nodeSpacing * 0.6; // 汇合点在中间偏右
    
    // 从链表A到相交点的连接线 - 使用简洁的折线
    if (lastAIndex >= 0 || listA.nodes.length > 0) {
      const actualLastAX = lastAIndex >= 0 ? lastAX : leftOffset;
      
      // 简洁的两段折线：水平 -> 斜向下
      const pathA = `M${actualLastAX + nodeRadius},${topRowY} 
                     L${mergeX},${topRowY} 
                     L${intersectionX - nodeRadius},${intersectionY}`;
      
      svg.append('path')
        .attr('d', pathA)
        .attr('stroke', '#3498db')
        .attr('stroke-width', 2.5)
        .attr('fill', 'none')
        .attr('marker-end', 'url(#arrow-marker-a)')
        .style('stroke-linecap', 'round')
        .style('stroke-linejoin', 'round')
        .style('pointer-events', 'none');
    }
    
    // 从链表B到相交点的连接线 - 使用简洁的折线
    if (lastBIndex >= 0 || listB.nodes.length > 0) {
      const actualLastBX = lastBIndex >= 0 ? lastBX : leftOffset;
      
      // 简洁的两段折线：水平 -> 斜向上
      const pathB = `M${actualLastBX + nodeRadius},${bottomRowY} 
                     L${mergeX},${bottomRowY} 
                     L${intersectionX - nodeRadius},${intersectionY}`;
      
      svg.append('path')
        .attr('d', pathB)
        .attr('stroke', '#9b59b6')
        .attr('stroke-width', 2.5)
        .attr('fill', 'none')
        .attr('marker-end', 'url(#arrow-marker-b)')
        .style('stroke-linecap', 'round')
        .style('stroke-linejoin', 'round')
        .style('pointer-events', 'none');
    }
    
    // 绘制相交部分的链表
    nodeInfo.intersectionNodes.forEach((node, i) => {
      const x = intersectionX + i * nodeSpacing;
      const y = intersectionY;
      
      // 绘制节点，使用更醒目的样式
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', nodeRadius)
        .attr('fill', 'url(#intersection-gradient)')
        .attr('stroke', '#c0392b') // 添加边框增强辨识度
        .attr('stroke-width', 1.5);
      
      // 添加节点值 - 优化特殊值的显示处理
      const nodeValue = node.val === undefined || node.val === null ? "无" : node.val;
      const valueFontSize = typeof nodeValue === 'string' && nodeValue.length > 2 ? 
        `${fontSize * 0.8}px` : `${fontSize}px`;
        
      svg.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'white')
        .attr('font-size', valueFontSize)
        .attr('font-weight', 'bold')
        .text(nodeValue);
      
      // 绘制连接线
      if (i < nodeInfo.intersectionNodes.length - 1) {
        const nextX = intersectionX + (i + 1) * nodeSpacing;
        
        svg.append('path')
          .attr('d', `M${x + nodeRadius},${y} C${x + nodeRadius * 2},${y} ${nextX - nodeRadius * 2},${y} ${nextX - nodeRadius},${y}`)
          .attr('stroke', '#e74c3c')
          .attr('stroke-width', 2)
          .attr('fill', 'none')
          .attr('marker-end', 'url(#arrow-marker-intersection)')
          .style('stroke-linecap', 'round');
      }
      
      // 高亮当前节点
      if (currentNodeA === node || currentNodeB === node) {
        const highlightColor = currentNodeA === node && currentNodeB === node 
          ? "#f39c12" // 两个指针都在这个节点
          : currentNodeA === node 
            ? "#2980b9" // 指针A在这个节点 
            : "#8e44ad"; // 指针B在这个节点
        
        const ringColor = currentNodeA === node && currentNodeB === node
          ? "#f39c12"
          : currentNodeA === node
            ? "#3498db"
            : "#9b59b6";
        
        // 为节点创建一个固定位置的组
        const nodeGroup = svg.append('g')
          .attr('transform', `translate(${x}, ${y})`);
        
        // 计算指针标签的位置和大小
        const pointerRadius = nodeRadius * 0.6;  // 指针圆圈的半径
        const pointerDistance = nodeRadius * 2.5;   // 指针距离节点中心的距离
        
        // 如果是指针A在节点上，则添加指针A的标记
        if (currentNodeA === node) {
          const pointerY = -pointerDistance;  // 指针A放在上方
          
          // 添加指针A的圆圈和标签
          const pointerGroup = nodeGroup.append('g')
            .attr('transform', `translate(0, ${pointerY})`);
          
          // 添加指针圆圈
          pointerGroup.append('circle')
            .attr('r', pointerRadius)
            .attr('fill', '#3498db')
            .attr('stroke', 'white')
            .attr('stroke-width', 2);
          
          // 添加指针标签
          pointerGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', 'white')
            .attr('font-size', `${fontSize * 0.7}px`)
            .attr('font-weight', 'bold')
            .text('A');
          
          // 添加指针A的垂直线和箭头
          const lineStartY = pointerY + pointerRadius;
          const lineEndY = -nodeRadius;
          
          // 画主线
          nodeGroup.append('line')
            .attr('x1', 0)
            .attr('y1', lineStartY)
            .attr('x2', 0)
            .attr('y2', lineEndY)
            .attr('stroke', '#3498db')
            .attr('stroke-width', 2.5);
          
          // 添加三角形箭头
          const arrowSize = 8;
          nodeGroup.append('path')
            .attr('d', `M${-arrowSize},${lineEndY + arrowSize} L0,${lineEndY} L${arrowSize},${lineEndY + arrowSize} Z`)
            .attr('fill', '#3498db');
          
          // 标记指针A已在相交部分渲染
          renderedPointers.pointerA.add(node);
        }
        
        // 如果是指针B在节点上，则添加指针B的标记
        if (currentNodeB === node) {
          const pointerY = pointerDistance;  // 指针B放在下方
          
          // 添加指针B的圆圈和标签
          const pointerGroup = nodeGroup.append('g')
            .attr('transform', `translate(0, ${pointerY})`);
          
          // 添加指针圆圈
          pointerGroup.append('circle')
            .attr('r', pointerRadius)
            .attr('fill', '#9b59b6')
            .attr('stroke', 'white')
            .attr('stroke-width', 2);
          
          // 添加指针标签
          pointerGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', 'white')
            .attr('font-size', `${fontSize * 0.7}px`)
            .attr('font-weight', 'bold')
            .text('B');
          
          // 添加指针B的垂直线和箭头
          const lineStartY = pointerY - pointerRadius;
          const lineEndY = nodeRadius;
          
          // 画主线
          nodeGroup.append('line')
            .attr('x1', 0)
            .attr('y1', lineStartY)
            .attr('x2', 0)
            .attr('y2', lineEndY)
            .attr('stroke', '#9b59b6')
            .attr('stroke-width', 2.5);
          
          // 添加三角形箭头
          const arrowSize = 8;
          nodeGroup.append('path')
            .attr('d', `M${-arrowSize},${lineEndY - arrowSize} L0,${lineEndY} L${arrowSize},${lineEndY - arrowSize} Z`)
            .attr('fill', '#9b59b6');
          
          // 标记指针B已在相交部分渲染
          renderedPointers.pointerB.add(node);
        }
      }
    });
  }
  
  // 最后渲染信息面板，确保它显示在最上层
  renderInfoPanel(
    svg, 
    message, 
    step, 
    viewBoxWidth, 
    viewBoxHeight, 
    scale
  );
  
  // 恢复指针位置计算和显示，但不再添加移动效果
  if (currentNodeA || currentNodeB) {
    // 当前节点A和B的位置计算
    let nodeAX = 0, nodeAY = 0;
    let nodeBX = 0, nodeBY = 0;
    
    // 计算指针A的位置
    if (currentNodeA) {
      // 检查是在哪个链表部分
      const isInIntersection = nodeInfo.intersectionNodes.includes(currentNodeA);
      const indexInA = !isInIntersection ? 
        nodeInfo.preIntersectionNodesA.findIndex(node => node === currentNodeA) : -1;
      const indexInB = !isInIntersection ? 
        nodeInfo.preIntersectionNodesB.findIndex(node => node === currentNodeA) : -1;
      const indexInIntersection = isInIntersection ? 
        nodeInfo.intersectionNodes.findIndex(node => node === currentNodeA) : -1;
        
      if (indexInA !== -1) {
        nodeAX = leftOffset + indexInA * nodeSpacing;
        nodeAY = topRowY;
        
        // 当指针A在链表A中时，不需要添加连线到链表末尾
      } else if (indexInB !== -1) {
        nodeAX = leftOffset + indexInB * nodeSpacing;
        nodeAY = bottomRowY;
        
        // 指针A在链表B中，说明A已经遍历完链表A，跳转到了链表B
        // 绘制从链表A末尾到链表B头部的跳转路径
        const headBX = leftOffset;
        const headBY = bottomRowY;
        
        // 计算链表A的末尾位置（相交前最后一个节点或相交部分最后一个节点）
        let endOfListAX: number;
        let endOfListAY: number;
        if (nodeInfo.hasIntersection && nodeInfo.intersectionNodes.length > 0) {
          // 如果有相交，末尾是相交部分的最后一个节点
          const lastIntersectionIndex = nodeInfo.intersectionNodes.length - 1;
          endOfListAX = nodeInfo.startX + lastIntersectionIndex * nodeSpacing;
          endOfListAY = (topRowY + bottomRowY) / 2;
        } else {
          // 没有相交，末尾是链表A的最后一个节点
          const lastAIndex = nodeInfo.preIntersectionNodesA.length - 1;
          endOfListAX = leftOffset + (lastAIndex >= 0 ? lastAIndex * nodeSpacing : 0);
          endOfListAY = topRowY;
        }
        
        // 绘制跳转路径：从链表A末尾 -> 向上弯曲 -> 到链表B头部
        const jumpHeight = 50; // 跳转弧线的高度
        const midX = (endOfListAX + headBX) / 2;
        const topY = Math.min(topRowY, bottomRowY) - jumpHeight;
        
        // 使用虚线绘制跳转路径
        svg.append('path')
          .attr('d', `M${endOfListAX + nodeRadius},${endOfListAY} 
                      Q${endOfListAX + nodeRadius + 30},${topY} ${midX},${topY}
                      Q${headBX - 30},${topY} ${headBX},${headBY - nodeRadius}`)
          .attr('stroke', '#3498db')
          .attr('stroke-width', 2.5)
          .attr('stroke-dasharray', '8,4')
          .attr('fill', 'none')
          .attr('opacity', 0.7)
          .attr('marker-end', 'url(#arrow-marker-a)')
          .style('pointer-events', 'none');
        
        // 添加跳转说明标签
        svg.append('text')
          .attr('x', midX)
          .attr('y', topY - 10)
          .attr('text-anchor', 'middle')
          .attr('fill', '#3498db')
          .attr('font-size', `${fontSize * 0.7}px`)
          .attr('font-weight', 'bold')
          .attr('opacity', 0.9)
          .text('pA 跳转到 headB');
      } else if (indexInIntersection !== -1) {
        nodeAX = nodeInfo.startX + indexInIntersection * nodeSpacing;
        nodeAY = (topRowY + bottomRowY) / 2;
      }
      
      // 只添加高亮和指针标识，不添加移动效果
      if (nodeAX > 0 && nodeAY > 0 && !renderedPointers.pointerA.has(currentNodeA)) {
        // 为节点创建一个固定位置的组
        const nodeGroup = svg.append('g')
          .attr('transform', `translate(${nodeAX}, ${nodeAY})`);
        
        // 计算指针A标签的位置和大小
        const pointerRadius = nodeRadius * 0.6;  // 指针圆圈的半径
        const pointerDistance = nodeRadius * 2.5;   // 指针距离节点中心的距离
        const pointerY = -pointerDistance;  // 指针A放在上方
        
        // 添加指针A的圆圈和标签
        const pointerGroup = nodeGroup.append('g')
          .attr('transform', `translate(0, ${pointerY})`);
        
        // 添加指针圆圈
        pointerGroup.append('circle')
          .attr('r', pointerRadius)
          .attr('fill', '#3498db')
          .attr('stroke', 'white')
          .attr('stroke-width', 2);
        
        // 添加指针标签
        pointerGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', 'white')
          .attr('font-size', `${fontSize * 0.7}px`)
          .attr('font-weight', 'bold')
          .text('A');
        
        // 添加指针A的垂直线和箭头
        const lineStartY = pointerY + pointerRadius;
        const lineEndY = -nodeRadius;
        
        // 画主线
        nodeGroup.append('line')
          .attr('x1', 0)
          .attr('y1', lineStartY)
          .attr('x2', 0)
          .attr('y2', lineEndY)
          .attr('stroke', '#3498db')
          .attr('stroke-width', 2.5);
        
        // 添加三角形箭头
        const arrowSize = 8;
        nodeGroup.append('path')
          .attr('d', `M${-arrowSize},${lineEndY + arrowSize} L0,${lineEndY} L${arrowSize},${lineEndY + arrowSize} Z`)
          .attr('fill', '#3498db');
          
        // 标记指针A已经被渲染
        renderedPointers.pointerA.add(currentNodeA);
      }
    }
    
    // 计算指针B的位置
    if (currentNodeB) {
      // 检查是在哪个链表部分
      const isInIntersection = nodeInfo.intersectionNodes.includes(currentNodeB);
      const indexInA = !isInIntersection ? 
        nodeInfo.preIntersectionNodesA.findIndex(node => node === currentNodeB) : -1;
      const indexInB = !isInIntersection ? 
        nodeInfo.preIntersectionNodesB.findIndex(node => node === currentNodeB) : -1;
      const indexInIntersection = isInIntersection ? 
        nodeInfo.intersectionNodes.findIndex(node => node === currentNodeB) : -1;
        
      if (indexInA !== -1) {
        nodeBX = leftOffset + indexInA * nodeSpacing;
        nodeBY = topRowY;
        
        // 指针B在链表A中，说明B已经遍历完链表B，跳转到了链表A
        // 绘制从链表B末尾到链表A头部的跳转路径
        const headAX = leftOffset;
        const headAY = topRowY;
        
        // 计算链表B的末尾位置
        let endOfListBX: number;
        let endOfListBY: number;
        if (nodeInfo.hasIntersection && nodeInfo.intersectionNodes.length > 0) {
          // 如果有相交，末尾是相交部分的最后一个节点
          const lastIntersectionIndex = nodeInfo.intersectionNodes.length - 1;
          endOfListBX = nodeInfo.startX + lastIntersectionIndex * nodeSpacing;
          endOfListBY = (topRowY + bottomRowY) / 2;
        } else {
          // 没有相交，末尾是链表B的最后一个节点
          const lastBIndex = nodeInfo.preIntersectionNodesB.length - 1;
          endOfListBX = leftOffset + (lastBIndex >= 0 ? lastBIndex * nodeSpacing : 0);
          endOfListBY = bottomRowY;
        }
        
        // 绘制跳转路径：从链表B末尾 -> 向下弯曲 -> 到链表A头部
        const jumpHeight = 50;
        const midX = (endOfListBX + headAX) / 2;
        const bottomY = Math.max(topRowY, bottomRowY) + jumpHeight;
        
        // 使用虚线绘制跳转路径
        svg.append('path')
          .attr('d', `M${endOfListBX + nodeRadius},${endOfListBY} 
                      Q${endOfListBX + nodeRadius + 30},${bottomY} ${midX},${bottomY}
                      Q${headAX - 30},${bottomY} ${headAX},${headAY + nodeRadius}`)
          .attr('stroke', '#9b59b6')
          .attr('stroke-width', 2.5)
          .attr('stroke-dasharray', '8,4')
          .attr('fill', 'none')
          .attr('opacity', 0.7)
          .attr('marker-end', 'url(#arrow-marker-b)')
          .style('pointer-events', 'none');
        
        // 添加跳转说明标签
        svg.append('text')
          .attr('x', midX)
          .attr('y', bottomY + 20)
          .attr('text-anchor', 'middle')
          .attr('fill', '#9b59b6')
          .attr('font-size', `${fontSize * 0.7}px`)
          .attr('font-weight', 'bold')
          .attr('opacity', 0.9)
          .text('pB 跳转到 headA');
      } else if (indexInB !== -1) {
        nodeBX = leftOffset + indexInB * nodeSpacing;
        nodeBY = bottomRowY;
        
        // 当指针B在链表B中时，不需要添加连线到链表末尾
      } else if (indexInIntersection !== -1) {
        nodeBX = nodeInfo.startX + indexInIntersection * nodeSpacing;
        nodeBY = (topRowY + bottomRowY) / 2;
      }
      
      // 只添加高亮和指针标识，不添加移动效果
      if (nodeBX > 0 && nodeBY > 0 && !renderedPointers.pointerB.has(currentNodeB)) {
        // 为节点创建一个固定位置的组
        const nodeGroup = svg.append('g')
          .attr('transform', `translate(${nodeBX}, ${nodeBY})`);
        
        // 计算指针B标签的位置和大小
        const pointerRadius = nodeRadius * 0.6;  // 指针圆圈的半径
        const pointerDistance = nodeRadius * 2.5;   // 指针距离节点中心的距离
        const pointerY = pointerDistance;  // 指针B放在下方
        
        // 添加指针B的圆圈和标签
        const pointerGroup = nodeGroup.append('g')
          .attr('transform', `translate(0, ${pointerY})`);
        
        // 添加指针圆圈
        pointerGroup.append('circle')
          .attr('r', pointerRadius)
          .attr('fill', '#9b59b6')
          .attr('stroke', 'white')
          .attr('stroke-width', 2);
        
        // 添加指针标签
        pointerGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', 'white')
          .attr('font-size', `${fontSize * 0.7}px`)
          .attr('font-weight', 'bold')
          .text('B');
        
        // 添加指针B的垂直线和箭头
        const lineStartY = pointerY - pointerRadius;
        const lineEndY = nodeRadius;
        
        // 画主线
        nodeGroup.append('line')
          .attr('x1', 0)
          .attr('y1', lineStartY)
          .attr('x2', 0)
          .attr('y2', lineEndY)
          .attr('stroke', '#9b59b6')
          .attr('stroke-width', 2.5);
        
        // 添加三角形箭头
        const arrowSize = 8;
        nodeGroup.append('path')
          .attr('d', `M${-arrowSize},${lineEndY - arrowSize} L0,${lineEndY} L${arrowSize},${lineEndY - arrowSize} Z`)
          .attr('fill', '#9b59b6');
          
        // 标记指针B已被渲染
        renderedPointers.pointerB.add(currentNodeB);
      }
    }
    
    // 处理指针A和B在相同位置的情况
    if (currentNodeA && currentNodeB && currentNodeA === currentNodeB) {
      // 添加相交效果
      addPointersIntersectEffect(svg, nodeAX, nodeAY, 1.2);
    }
    
    // 在所有渲染完成后，添加动画效果
    applyAnimationEffects(svg, currentNodeA, currentNodeB, nodePositions, nodeRadius, scale);
  }
}; 