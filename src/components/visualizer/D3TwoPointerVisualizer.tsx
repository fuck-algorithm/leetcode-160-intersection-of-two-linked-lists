import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { ListNode, LinkedListData } from '../../types';
import { createGradientDefs } from '../../utils/d3utils/gradients';
import { drawLinkedList, isNodeInIntersection } from './LinkedListRenderer';
import { renderIntersectionPart, renderIntersectionConnectors } from './IntersectionRenderer';
import { renderPointerJumps } from './PointerJumpRenderer';
import { renderInfoPanel, renderAlgorithmPanel } from './InfoPanel';

interface D3TwoPointerVisualizerProps {
  listA: LinkedListData;
  listB: LinkedListData;
  currentNodeA: ListNode | null;
  currentNodeB: ListNode | null;
  intersectionNode: ListNode | null;
  speed: number;
  isRunning: boolean;
  message: string;
  step: number;
  onAnimationComplete?: () => void;
}

const D3TwoPointerVisualizer: React.FC<D3TwoPointerVisualizerProps> = ({
  listA,
  listB,
  currentNodeA,
  currentNodeB,
  intersectionNode,
  speed,
  isRunning,
  message,
  step,
  onAnimationComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 600 });

  // 监听容器尺寸变化
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    // 初始设置尺寸
    updateSize();

    // 使用ResizeObserver监听容器大小变化
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);

    // 清理函数
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  // 处理自动执行时的动画完成事件
  useEffect(() => {
    if (isRunning && onAnimationComplete) {
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentNodeA, currentNodeB, isRunning, onAnimationComplete, speed]);

  // 根据当前状态渲染链表
  useEffect(() => {
    // 当列表内容变化或容器大小变化时重新渲染
    renderLists();
  }, [listA, listB, currentNodeA, currentNodeB, intersectionNode, containerSize, message, step]);

  // 检查是否允许添加调试日志
  const logPointerPositions = () => {
    if (currentNodeA) {
      console.log(`指针A当前在节点值: ${currentNodeA.val}`);
    }
    if (currentNodeB) {
      console.log(`指针B当前在节点值: ${currentNodeB.val}`);
    }
  };

  // 渲染链表
  const renderLists = () => {
    if (!containerRef.current) return;

    // 清除现有内容
    d3.select(containerRef.current).selectAll('*').remove();

    // 如果链表都为空，显示提示信息
    if (listA.nodes.length === 0 && listB.nodes.length === 0) {
      const container = d3.select(containerRef.current);
      container.append('div')
        .style('display', 'flex')
        .style('justify-content', 'center')
        .style('align-items', 'center')
        .style('height', '100%')
        .style('width', '100%')
        .style('color', '#2c3e50')
        .style('font-weight', 'bold')
        .style('font-size', '18px')
        .text('请点击"创建示例"按钮创建链表');
      return;
    }

    // 计算合适的视图大小，基于容器尺寸和链表长度
    const totalNodesA = listA.nodes.length;
    const totalNodesB = listB.nodes.length;
    const maxNodeCount = Math.max(totalNodesA, totalNodesB);
    
    // 根据节点数量动态调整视图宽度和节点间距
    // 为长链表提供更紧凑的布局，为短链表提供更宽松的布局
    const nodeSpacingFactor = maxNodeCount > 15 ? 0.7 : (maxNodeCount > 10 ? 0.8 : 1.5);
    
    const aspectRatio = containerSize.width / containerSize.height;
    // 确保视图宽度能够容纳所有节点，同时确保充分利用整个可视区域
    const viewBoxWidth = 1800; // 减小固定宽度，使内容更加紧凑
    // 降低高度比例，让图表更宽扁
    const viewBoxHeight = 500;
    
    // 创建主SVG
    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
      .attr('preserveAspectRatio', 'xMinYMid meet'); // 改回左对齐，避免水平居中造成空白

    // 寻找相交节点的索引
    const intersectionNodeIndexA = intersectionNode ? 
      listA.nodes.findIndex(node => node === intersectionNode) : -1;
    const intersectionNodeIndexB = intersectionNode ? 
      listB.nodes.findIndex(node => node === intersectionNode) : -1;
    
    // 计算链表A和B（相交前部分）的节点
    const preIntersectionNodesA = intersectionNodeIndexA !== -1 
      ? listA.nodes.slice(0, intersectionNodeIndexA) 
      : listA.nodes;
    
    const preIntersectionNodesB = intersectionNodeIndexB !== -1 
      ? listB.nodes.slice(0, intersectionNodeIndexB) 
      : listB.nodes;
    
    // 计算相交部分的节点
    const intersectionNodes = (intersectionNodeIndexA !== -1 && intersectionNodeIndexA < listA.nodes.length)
      ? listA.nodes.slice(intersectionNodeIndexA)
      : [];

    // 判断链表是否实际相交
    const hasIntersection = intersectionNodes.length > 0;

    // 计算布局参数 - 根据容器大小动态调整
    const scale = Math.min(containerSize.width / 1000, containerSize.height / 500);
    const nodeRadius = Math.max(18, Math.min(22, 22 * scale));
    
    // 计算实际节点数量（包括相交部分）
    const totalEffectiveNodes = Math.max(
      preIntersectionNodesA.length + (hasIntersection ? intersectionNodes.length : 0),
      preIntersectionNodesB.length + (hasIntersection ? intersectionNodes.length : 0)
    );
    
    // 可用宽度为整个视图宽度减去左侧边距和右侧边距
    const leftMargin = 80; // 为链表标签和左侧留一些空间
    const rightMargin = 0; // 不保留右侧边距，让链表完全扩展
    const usableWidth = viewBoxWidth - leftMargin - rightMargin;
    
    // 计算节点间距，确保链表完全填充整个屏幕宽度
    // 如果节点数量为1，使用默认间距
    let nodeSpacing;
    if (totalEffectiveNodes <= 1) {
      nodeSpacing = 100; // 默认间距
    } else {
      // 计算总节点直径
      const totalNodeDiameter = nodeRadius * 2 * totalEffectiveNodes;
      // 计算可用的间距总长度
      const totalSpacingAvailable = usableWidth - totalNodeDiameter;
      // 每个间距的长度 (间距数量为节点数-1)
      nodeSpacing = totalSpacingAvailable / (totalEffectiveNodes - 1);
      // 确保最小间距不会小于节点本身
      nodeSpacing = Math.max(nodeSpacing, nodeRadius * 2.2);
    }
    
    // 调整垂直布局，更合理地分布链表，让整体视图更加紧凑
    const topRowY = viewBoxHeight * 0.35;    // 稍微下移链表A
    const bottomRowY = viewBoxHeight * 0.65; // 稍微上移链表B
    const intersectionRowY = viewBoxHeight * 0.50;
    
    // 左侧边距设置为固定值，而不是基于视图宽度的百分比
    const leftOffset = leftMargin;
    
    // 添加信息面板 - 显示步骤和消息
    renderInfoPanel(svg, message, step, viewBoxWidth, viewBoxHeight, scale);
    
    // 注释掉或删除算法说明面板的渲染
    // 移除算法说明面板，增加可视化空间
    // renderAlgorithmPanel(svg, viewBoxWidth, viewBoxHeight, scale);
    
    // 创建渐变和样式定义
    createGradientDefs(svg);
    
    // 添加标签
    const fontSize = Math.max(14, Math.min(16, 16 * scale));

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

    // 确定当前指针A是否在链表B中（在B的非相交部分）
    const isPointerAInListB = currentNodeA !== null && 
                             !isNodeInIntersection(currentNodeA, intersectionNodes) && 
                             listB.nodes.includes(currentNodeA);
    
    // 确定当前指针B是否在链表A中（在A的非相交部分）
    const isPointerBInListA = currentNodeB !== null && 
                             !isNodeInIntersection(currentNodeB, intersectionNodes) && 
                             listA.nodes.includes(currentNodeB);
    
    // 绘制链表A (相交前部分)
    drawLinkedList(svg, preIntersectionNodesA, topRowY, leftOffset, nodeRadius, nodeSpacing, 
                  'url(#node-a-gradient)', 
                  isPointerAInListB ? null : currentNodeA, 
                  '#2980b9', isPointerAInListB ? null : 'pA', scale);

    // 绘制链表B (相交前部分)
    drawLinkedList(svg, preIntersectionNodesB, bottomRowY, leftOffset, nodeRadius, nodeSpacing, 
                  'url(#node-b-gradient)', 
                  isPointerBInListA ? null : currentNodeB,
                  '#8e44ad', isPointerBInListA ? null : 'pB', scale);

    // 计算相交部分的起始X坐标（无论是否相交，都先计算）
    const startX = Math.max(
      leftOffset + preIntersectionNodesA.length * nodeSpacing + nodeRadius,
      leftOffset + preIntersectionNodesB.length * nodeSpacing + nodeRadius
    );

    // 以下是相交部分的处理，只有当实际存在相交节点时才执行
    if (hasIntersection) {
      // 添加调试日志，仅在开发模式下启用
      if (process.env.NODE_ENV === 'development' && (currentNodeA || currentNodeB)) {
        logPointerPositions();
      }

      // 渲染相交部分
      renderIntersectionPart(
        svg, 
        intersectionNodes, 
        currentNodeA, 
        currentNodeB, 
        startX, 
        intersectionRowY, 
        nodeRadius, 
        nodeSpacing, 
        fontSize, 
        scale
      );
      
      // 渲染从链表A和链表B到相交部分的连接线
      renderIntersectionConnectors(
        svg, 
        preIntersectionNodesA, 
        preIntersectionNodesB, 
        startX, 
        intersectionRowY, 
        leftOffset, 
        topRowY, 
        bottomRowY, 
        nodeRadius, 
        nodeSpacing, 
        fontSize, 
        scale
      );
    }
    
    // 渲染指针跳转
    renderPointerJumps(
      svg, 
      listA.nodes, 
      listB.nodes, 
      intersectionNodes, 
      currentNodeA, 
      currentNodeB, 
      leftOffset, 
      startX, 
      topRowY, 
      bottomRowY, 
      intersectionRowY, 
      nodeRadius, 
      nodeSpacing, 
      fontSize, 
      scale
    );
  };

  return (
    <div 
      ref={containerRef} 
      className="d3-visualizer-container"
    />
  );
};

export default D3TwoPointerVisualizer; 