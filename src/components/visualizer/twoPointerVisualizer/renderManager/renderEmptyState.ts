import * as d3 from 'd3';

/**
 * 空容器时的提示信息
 */
export const renderEmptyState = (container: HTMLDivElement) => {
  d3.select(container)
    .append('div')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('align-items', 'center')
    .style('height', '100%')
    .style('width', '100%')
    .style('color', '#2c3e50')
    .style('font-weight', 'bold')
    .style('font-size', '18px')
    .text('请点击"创建示例"按钮创建链表');
}; 