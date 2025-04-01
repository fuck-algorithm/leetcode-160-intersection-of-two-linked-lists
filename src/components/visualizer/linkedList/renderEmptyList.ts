import * as d3 from 'd3';

/**
 * 渲染空链表状态
 */
export const renderEmptyList = (container: HTMLDivElement) => {
  // 清除内容
  d3.select(container).selectAll('*').remove();
  
  // 显示空列表信息
  d3.select(container)
    .append('div')
    .attr('class', 'empty-list')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('align-items', 'center')
    .style('height', '100px')
    .style('width', '100%')
    .style('color', 'var(--dark-color)')
    .style('font-weight', 'bold')
    .text('空链表');
}; 