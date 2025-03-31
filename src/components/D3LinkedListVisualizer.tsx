import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { ListNode, LinkedListData } from '../types';

interface D3LinkedListVisualizerProps {
  linkedList: LinkedListData;
  currentNode: ListNode | null;
  intersectionNode: ListNode | null;
  label: string;
  id: string;
  otherList?: LinkedListData; // 添加另一个链表的引用，用于绘制相交路径
}

const D3LinkedListVisualizer: React.FC<D3LinkedListVisualizerProps> = ({
  linkedList,
  currentNode,
  intersectionNode,
  label,
  id,
  otherList
}) => {
  const d3Container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (d3Container.current && linkedList.nodes.length > 0) {
      // 清除现有内容
      d3.select(d3Container.current).selectAll('*').remove();
      
      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', '100%')
        .attr('height', 200)
        .attr('viewBox', `0 0 ${linkedList.nodes.length * 120} 200`)
        .attr('preserveAspectRatio', 'xMinYMin meet');

      // 计算布局
      const nodeRadius = 30;
      const nodeSpacing = 120;
      const verticalOffset = 100;

      // 找出相交节点的索引（如果存在）
      const intersectionIndex = intersectionNode 
        ? linkedList.nodes.findIndex(node => node === intersectionNode)
        : -1;

      // 创建渐变和标记
      const defs = svg.append('defs');
      
      // 普通节点渐变
      const nodeGradient = defs.append('linearGradient')
        .attr('id', `node-gradient-${id}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');
      
      nodeGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#3498db');
      
      nodeGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#2980b9');

      // 交点节点渐变
      const intersectionGradient = defs.append('linearGradient')
        .attr('id', `intersection-gradient-${id}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');
      
      intersectionGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#e74c3c');
      
      intersectionGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#c0392b');

      // 当前节点渐变
      const currentGradient = defs.append('linearGradient')
        .attr('id', `current-gradient-${id}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');
      
      currentGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#f39c12');
      
      currentGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#d35400');

      // 添加箭头标记
      defs.append('marker')
        .attr('id', `arrow-${id}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', 'var(--dark-color)');

      // 如果是第二个链表并且有相交点，创建一个连接线到相交点
      if (id === "list-b" && intersectionNode && otherList) {
        // 找到在otherList中相交点的索引
        const otherIntersectionIndex = otherList.nodes.findIndex(node => node === intersectionNode);
        
        if (otherIntersectionIndex >= 0 && intersectionIndex >= 0) {
          // 构建一条从list-b到list-a相交节点的路径
          const otherListNodeX = otherIntersectionIndex * nodeSpacing + nodeRadius + 20;
          const thisListNodeX = intersectionIndex * nodeSpacing + nodeRadius + 20;
          
          // 创建一条弯曲的路径，连接两个列表的相交点位置
          const connectingPath = svg.append('path')
            .attr('class', 'intersection-path')
            .attr('d', `M${thisListNodeX},${verticalOffset - 60} C${thisListNodeX - 40},${verticalOffset - 100} ${otherListNodeX + 40},${verticalOffset - 100} ${otherListNodeX},${verticalOffset - 60}`)
            .attr('stroke', 'var(--accent-color)')
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', '5,5')
            .attr('fill', 'none')
            .attr('opacity', 0);

          // 添加动画效果
          connectingPath.transition()
            .duration(1000)
            .attr('opacity', 1)
            .on('end', function() {
              d3.select(this)
                .transition()
                .duration(800)
                .attr('stroke-dasharray', '5,5')
                .attr('stroke-dashoffset', -20)
                .ease(d3.easeLinear)
                .on('end', function repeat() {
                  d3.select(this)
                    .transition()
                    .duration(800)
                    .attr('stroke-dashoffset', -40)
                    .ease(d3.easeLinear)
                    .on('end', repeat);
                });
            });

          // 添加相交文本说明
          svg.append('text')
            .attr('x', thisListNodeX)
            .attr('y', verticalOffset - 70)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('fill', 'var(--accent-color)')
            .attr('font-weight', 'bold')
            .text('相交点')
            .attr('opacity', 0)
            .transition()
            .duration(1000)
            .delay(500)
            .attr('opacity', 1);
        }
      }

      // 创建节点组
      const nodeGroups = svg.selectAll('g.node')
        .data(linkedList.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d, i) => `translate(${(i * nodeSpacing) + nodeRadius + 20}, ${verticalOffset})`)
        .style('cursor', 'pointer');

      // 添加发光效果
      nodeGroups.append('circle')
        .attr('class', 'node-glow')
        .attr('r', nodeRadius * 1.2)
        .attr('fill', 'rgba(52, 152, 219, 0.3)')
        .attr('opacity', 0);
      
      // 添加连接线
      for (let i = 0; i < linkedList.nodes.length - 1; i++) {
        const isTargetIntersection = i + 1 >= intersectionIndex && intersectionIndex >= 0;
          
        const path = svg.append('path')
          .attr('d', `M${(i * nodeSpacing) + nodeRadius * 2 + 20} ${verticalOffset} H${(i+1) * nodeSpacing + 20}`)
          .attr('stroke', isTargetIntersection ? 'var(--accent-color)' : 'var(--dark-color)')
          .attr('stroke-width', 3)
          .attr('fill', 'none')
          .attr('marker-end', `url(#arrow-${id})`)
          .attr('opacity', 0);

        // 箭头动画
        path.transition()
          .duration(300)
          .delay(i * 200)
          .attr('opacity', 1)
          .transition()
          .duration(500)
          .attr('stroke-dasharray', isTargetIntersection ? '4,4' : 'none')
          .attr('d', function() {
            const pathData = d3.select(this).attr('d');
            return pathData;
          });
      }

      // 绘制节点圆圈
      const circles = nodeGroups.append('circle')
        .attr('r', 0) // 开始时半径为0
        .attr('fill', (d, i) => {
          if (i >= intersectionIndex && intersectionIndex >= 0) 
            return `url(#intersection-gradient-${id})`;
          if (d === currentNode) 
            return `url(#current-gradient-${id})`;
          return `url(#node-gradient-${id})`;
        })
        .attr('stroke', d => {
          if (d === currentNode) return '#ffc107';
          return 'none';
        })
        .attr('stroke-width', 3)
        .style('filter', 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))');

      // 节点出现动画
      circles.transition()
        .duration(500)
        .delay((d, i) => i * 200)
        .attr('r', nodeRadius)
        .on('end', function(d, i) {
          // 如果是相交节点，添加脉冲动画
          if (i >= intersectionIndex && intersectionIndex >= 0) {
            // 安全地处理DOM节点，获取当前圆圈的父节点并找到节点发光效果
            const element = d3.select(this).node() as Element;
            const parent = element.parentElement;
            
            if (parent) {
              const glowElement = parent.querySelector('.node-glow');
              if (glowElement) {
                d3.select(glowElement)
                  .attr('opacity', 0.6)
                  .attr('fill', 'rgba(231, 76, 60, 0.3)')
                  .transition()
                  .duration(1000)
                  .attr('r', nodeRadius * 1.4)
                  .attr('opacity', 0)
                  .on('end', function repeat() {
                    d3.select(this)
                      .attr('r', nodeRadius * 1.2)
                      .attr('opacity', 0.6)
                      .transition()
                      .duration(1000)
                      .attr('r', nodeRadius * 1.4)
                      .attr('opacity', 0)
                      .on('end', repeat);
                  });
              }
            }
          }
          
          // 当前节点高亮动画
          if (d === currentNode) {
            d3.select(this)
              .transition()
              .duration(800)
              .attr('r', nodeRadius * 1.1)
              .transition()
              .duration(800)
              .attr('r', nodeRadius)
              .on('end', function repeat() {
                d3.select(this)
                  .transition()
                  .duration(800)
                  .attr('r', nodeRadius * 1.1)
                  .transition()
                  .duration(800)
                  .attr('r', nodeRadius)
                  .on('end', repeat);
              });
          }
        });

      // 添加节点值文本
      nodeGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.3em')
        .attr('fill', 'white')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('opacity', 0)
        .text(d => d.val)
        .transition()
        .duration(300)
        .delay((d, i) => i * 200 + 200)
        .attr('opacity', 1);

      // 添加交互效果
      nodeGroups.on('mouseover', function(event, d) {
        d3.select(this).select('circle')
          .transition()
          .duration(300)
          .attr('r', nodeRadius * 1.1);
          
        if (!d3.select(this).select('.node-tooltip').size()) {          
          d3.select(this).append('text')
            .attr('class', 'node-tooltip')
            .attr('text-anchor', 'middle')
            .attr('y', -nodeRadius - 10)
            .attr('fill', 'var(--dark-color)')
            .attr('font-size', '12px')
            .text(`值: ${(d as ListNode).val}`)
            .attr('opacity', 0)
            .transition()
            .duration(300)
            .attr('opacity', 1);
        }
      }).on('mouseout', function(event, d) {
        d3.select(this).select('circle')
          .transition()
          .duration(300)
          .attr('r', d === currentNode ? nodeRadius * 1.1 : nodeRadius);
          
        d3.select(this).select('.node-tooltip')
          .transition()
          .duration(300)
          .attr('opacity', 0)
          .remove();
      });

      // 如果当前节点不为空，自动滚动到当前节点
      if (currentNode) {
        const currentNodeIndex = linkedList.nodes.findIndex(node => node === currentNode);
        if (currentNodeIndex >= 0 && d3Container.current) {
          const scrollPosition = currentNodeIndex * nodeSpacing;
          d3Container.current.scrollLeft = scrollPosition - 100;
        }
      }
    } else if (d3Container.current && linkedList.nodes.length === 0) {
      // 清除内容
      d3.select(d3Container.current).selectAll('*').remove();
      
      // 显示空列表信息
      const container = d3.select(d3Container.current);
      
      container.append('div')
        .attr('class', 'empty-list')
        .style('display', 'flex')
        .style('justify-content', 'center')
        .style('align-items', 'center')
        .style('height', '100px')
        .style('width', '100%')
        .style('color', 'var(--dark-color)')
        .style('font-weight', 'bold')
        .text('空链表');
    }
  }, [linkedList, currentNode, intersectionNode, id, otherList]);

  return (
    <div className="linked-list-section">
      <h3>{label}</h3>
      <div className="d3-container" ref={d3Container} id={id}></div>
    </div>
  );
};

export default D3LinkedListVisualizer; 