import * as d3 from 'd3';
import { LinkedListData, ListNode } from '../../../types';
import { drawNodes } from '../nodes';
import { drawConnections } from '../connections';
import { drawIntersectionPath } from './drawIntersectionPath';
import { renderEmptyList } from './renderEmptyList';
import { setupLinkedListSVG } from './setupLinkedListSVG';

interface RenderLinkedListParams {
  container: HTMLDivElement | null;
  linkedList: LinkedListData;
  currentNode: ListNode | null;
  intersectionNode: ListNode | null;
  id: string;
  otherList?: LinkedListData;
}

/**
 * 渲染链表组件
 */
export const renderLinkedList = ({
  container,
  linkedList,
  currentNode,
  intersectionNode,
  id,
  otherList
}: RenderLinkedListParams) => {
  if (!container) return;
  
  // 配置参数
  const nodeRadius = 30;
  const nodeSpacing = 120;
  const verticalOffset = 100;

  // 如果链表为空，显示空状态
  if (!linkedList.nodes.length) {
    renderEmptyList(container);
    return;
  }

  // 找出相交节点的索引（如果存在）
  const intersectionIndex = intersectionNode 
    ? linkedList.nodes.findIndex(node => node === intersectionNode)
    : -1;

  // 创建和设置SVG环境
  const svg = setupLinkedListSVG(container, linkedList.nodes.length, id);

  // 如果是第二个链表并且有相交点，创建一个连接线到相交点
  if (id === "list-b" && intersectionNode && otherList) {
    drawIntersectionPath(
      svg, 
      intersectionNode, 
      intersectionIndex, 
      otherList, 
      nodeRadius, 
      nodeSpacing, 
      verticalOffset
    );
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
  drawConnections(svg, linkedList, nodeRadius, nodeSpacing, verticalOffset, intersectionIndex, id);

  // 绘制节点
  drawNodes(nodeGroups, currentNode, nodeRadius, intersectionIndex, id, intersectionNode);

  // 如果当前节点不为空，自动滚动到当前节点
  scrollToCurrentNode(container, currentNode, linkedList, nodeSpacing);
};

/**
 * 自动滚动到当前节点
 */
const scrollToCurrentNode = (
  container: HTMLDivElement, 
  currentNode: ListNode | null, 
  linkedList: LinkedListData, 
  nodeSpacing: number
) => {
  if (!currentNode) return;
  
  const currentNodeIndex = linkedList.nodes.findIndex(node => node === currentNode);
  if (currentNodeIndex >= 0) {
    const scrollPosition = currentNodeIndex * nodeSpacing;
    container.scrollLeft = scrollPosition - 100;
  }
}; 