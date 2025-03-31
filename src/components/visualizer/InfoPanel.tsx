import * as d3 from 'd3';
import { wrapText } from '../../utils/d3utils/text';

/**
 * 渲染信息面板 - 用于显示步骤和消息
 */
export const renderInfoPanel = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  message: string,
  step: number,
  viewBoxWidth: number,
  viewBoxHeight: number,
  scale: number = 1
) => {
  const infoPanel = svg.append('g')
    .attr('class', 'info-panel')
    .attr('transform', `translate(${viewBoxWidth * 0.5}, ${viewBoxHeight * 0.08})`);
  
  // 添加背景
  infoPanel.append('rect')
    .attr('x', -250)
    .attr('y', -30)
    .attr('width', 500)
    .attr('height', 60)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('fill', 'rgba(44, 62, 80, 0.1)')
    .attr('stroke', 'rgba(44, 62, 80, 0.2)')
    .attr('stroke-width', 1);
  
  // 添加步骤计数
  infoPanel.append('text')
    .attr('x', -230)
    .attr('y', 0)
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', 14 * scale)
    .attr('font-weight', 'bold')
    .attr('fill', 'var(--primary-color)')
    .text(`步骤: ${step}`);
  
  // 添加消息文本
  infoPanel.append('text')
    .attr('x', -160)
    .attr('y', 0)
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', 14 * scale)
    .attr('fill', 'var(--dark-color)')
    .text(message)
    .call(wrapText, 350, 18 * scale);
};

/**
 * 渲染算法说明面板
 */
export const renderAlgorithmPanel = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  viewBoxWidth: number,
  viewBoxHeight: number,
  scale: number = 1
) => {
  // 移动到右上角，更好地利用空间
  const algorithmPanel = svg.append('g')
    .attr('class', 'algorithm-panel')
    .attr('transform', `translate(${viewBoxWidth * 0.85}, ${viewBoxHeight * 0.15})`);
  
  // 调整背景大小和位置
  algorithmPanel.append('rect')
    .attr('x', -200)
    .attr('y', -50)
    .attr('width', 350)
    .attr('height', 100)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('fill', 'rgba(52, 152, 219, 0.1)')
    .attr('stroke', 'rgba(52, 152, 219, 0.3)')
    .attr('stroke-width', 1);
  
  // 添加说明标题
  algorithmPanel.append('text')
    .attr('x', -190)
    .attr('y', -25)
    .attr('text-anchor', 'start')
    .attr('font-size', 14 * scale)
    .attr('font-weight', 'bold')
    .attr('fill', 'var(--primary-color)')
    .text('双指针解法说明:');
  
  // 添加说明文本，调整位置和行间距
  const explanationText = algorithmPanel.append('text')
    .attr('x', -190)
    .attr('y', 0)
    .attr('text-anchor', 'start')
    .attr('font-size', 12 * scale)
    .attr('fill', 'var(--dark-color)')
    .text('指针A和指针B分别从两个链表的头部开始，当一个指针到达链表末尾时，');
  
  explanationText.append('tspan')
    .attr('x', -190)
    .attr('dy', 20)
    .text('直接跳转到另一个链表的头部。当两个指针相遇时，他们要么都在');
  
  explanationText.append('tspan')
    .attr('x', -190)
    .attr('dy', 20)
    .text('交点处（相交），要么都不相遇（无交点）。');
}; 