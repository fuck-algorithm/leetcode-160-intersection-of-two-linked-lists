import { Selection } from 'd3';
import { ListNode, LinkedListData } from '../../../../types';
import { drawLinkedList } from '../../LinkedListRenderer';
import { NodeCalculationResult } from '../nodeUtils';

/**
 * 渲染链表组件 - 简化接口，兼容旧有调用
 */
export function renderLinkedLists(
  containerRef: HTMLDivElement,
  svg: Selection<SVGSVGElement, unknown, null, undefined>,
  listA: LinkedListData,
  listB: LinkedListData,
  intersectionNode: ListNode | null,
  currentNodeA: ListNode | null,
  currentNodeB: ListNode | null
): void;

/**
 * 渲染链表组件 - 新接口，使用对象参数方式
 */
export function renderLinkedLists(
  params: {
    svg: Selection<SVGSVGElement, unknown, null, undefined>;
    nodeInfo: NodeCalculationResult;
    layoutParams: {
      topRowY: number;
      bottomRowY: number;
      leftOffset: number;
      nodeRadius: number;
      nodeSpacing: number;
      fontSize: number;
      scale: number;
    };
    currentNodeA: ListNode | null;
    currentNodeB: ListNode | null;
  }
): void;

/**
 * 渲染链表及其标签 - 实现
 */
export function renderLinkedLists(
  containerRefOrParams: HTMLDivElement | {
    svg: Selection<SVGSVGElement, unknown, null, undefined>;
    nodeInfo: NodeCalculationResult;
    layoutParams: {
      topRowY: number;
      bottomRowY: number;
      leftOffset: number;
      nodeRadius: number;
      nodeSpacing: number;
      fontSize: number;
      scale: number;
    };
    currentNodeA: ListNode | null;
    currentNodeB: ListNode | null;
  },
  svg?: Selection<SVGSVGElement, unknown, null, undefined>,
  listA?: LinkedListData,
  listB?: LinkedListData,
  intersectionNode?: ListNode | null,
  currentNodeA?: ListNode | null,
  currentNodeB?: ListNode | null
): void {
  // 检查是否使用新接口
  if (typeof containerRefOrParams !== 'string' && !(containerRefOrParams instanceof HTMLDivElement)) {
    const params = containerRefOrParams;
    const { svg, nodeInfo, layoutParams, currentNodeA, currentNodeB } = params;
    
    const { 
      topRowY, 
      bottomRowY, 
      leftOffset, 
      nodeRadius, 
      nodeSpacing,
      fontSize,
      scale 
    } = layoutParams;
    
    const { 
      preIntersectionNodesA, 
      preIntersectionNodesB, 
      isPointerAInListB, 
      isPointerBInListA 
    } = nodeInfo;

    // 添加链表标签
    svg.append('text')
      .attr('x', 50)
      .attr('y', topRowY - nodeRadius - 10)
      .attr('fill', '#3498db')
      .attr('font-weight', 'bold')
      .attr('font-size', `${fontSize}px`)
      .text('链表 A:');

    svg.append('text')
      .attr('x', 50)
      .attr('y', bottomRowY - nodeRadius - 10)
      .attr('fill', '#9b59b6')
      .attr('font-weight', 'bold')
      .attr('font-size', `${fontSize}px`)
      .text('链表 B:');

    // 绘制链表A (相交前部分)
    drawLinkedList(
      svg, 
      preIntersectionNodesA, 
      topRowY, 
      leftOffset, 
      nodeRadius, 
      nodeSpacing, 
      'url(#node-a-gradient)', 
      isPointerAInListB ? null : currentNodeA, 
      '#2980b9', 
      isPointerAInListB ? null : 'pA', 
      scale
    );

    // 绘制链表B (相交前部分)
    drawLinkedList(
      svg, 
      preIntersectionNodesB, 
      bottomRowY, 
      leftOffset, 
      nodeRadius, 
      nodeSpacing, 
      'url(#node-b-gradient)', 
      isPointerBInListA ? null : currentNodeB,
      '#8e44ad', 
      isPointerBInListA ? null : 'pB', 
      scale
    );
  } else {
    // 旧接口实现，确保向后兼容
    if (containerRefOrParams instanceof HTMLDivElement && svg && listA && listB) {
      // 确保参数是非undefined的
      const safeCurrentNodeA = currentNodeA || null;
      const safeCurrentNodeB = currentNodeB || null;
      const safeIntersectionNode = intersectionNode || null;
      
      // 默认参数
      const nodeRadius = 30;
      const nodeSpacing = 120;
      const topRowY = 100;
      const bottomRowY = 250;
      const leftOffset = 50;
      const fontSize = 20;
      const scale = 1;
      
      // 添加链表标签
      svg.append('text')
        .attr('x', 50)
        .attr('y', topRowY - nodeRadius - 10)
        .attr('fill', '#3498db')
        .attr('font-weight', 'bold')
        .attr('font-size', `${fontSize}px`)
        .text('链表 A:');

      svg.append('text')
        .attr('x', 50)
        .attr('y', bottomRowY - nodeRadius - 10)
        .attr('fill', '#9b59b6')
        .attr('font-weight', 'bold')
        .attr('font-size', `${fontSize}px`)
        .text('链表 B:');
        
      // 判断第一个链表是否为空
      if (listA.nodes.length > 0) {
        // 计算相交节点的索引（如果存在）
        const intersectionIndex = safeIntersectionNode 
          ? listA.nodes.findIndex(node => node === safeIntersectionNode)
          : -1;
          
        // 处理指针A是否在链表B中的情况
        const isPointerAInListB = safeCurrentNodeA && !listA.nodes.includes(safeCurrentNodeA) && listB.nodes.includes(safeCurrentNodeA);
        
        // 绘制链表A
        drawLinkedList(
          svg, 
          listA.nodes, 
          topRowY, 
          leftOffset, 
          nodeRadius, 
          nodeSpacing, 
          'url(#node-a-gradient)', 
          isPointerAInListB ? null : safeCurrentNodeA, 
          '#2980b9', 
          isPointerAInListB ? null : 'pA', 
          scale
        );
      }
      
      // 判断第二个链表是否为空
      if (listB.nodes.length > 0) {
        // 计算相交节点的索引（如果存在）
        const intersectionIndex = safeIntersectionNode 
          ? listB.nodes.findIndex(node => node === safeIntersectionNode)
          : -1;
          
        // 处理指针B是否在链表A中的情况
        const isPointerBInListA = safeCurrentNodeB && !listB.nodes.includes(safeCurrentNodeB) && listA.nodes.includes(safeCurrentNodeB);
        
        // 绘制链表B
        drawLinkedList(
          svg, 
          listB.nodes, 
          bottomRowY, 
          leftOffset, 
          nodeRadius, 
          nodeSpacing, 
          'url(#node-b-gradient)', 
          isPointerBInListA ? null : safeCurrentNodeB,
          '#8e44ad', 
          isPointerBInListA ? null : 'pB', 
          scale
        );
      }
    } else {
      console.error('使用旧接口时缺少必要的参数');
    }
  }
} 