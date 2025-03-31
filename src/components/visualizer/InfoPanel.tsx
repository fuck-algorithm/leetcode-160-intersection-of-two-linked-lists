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
  // 移除先前的信息面板（如果有）
  svg.selectAll('.info-panel').remove();
  
  // 将面板位置调整更靠上
  const infoPanel = svg.append('g')
    .attr('class', 'info-panel')
    .attr('transform', `translate(${viewBoxWidth * 0.5}, ${viewBoxHeight * 0.05})`);
  
  // 计算面板宽度 - 对于中文宽度需要增加一些额外空间
  const panelWidth = Math.min(viewBoxWidth * 0.8, 800); // 限制最大宽度但确保足够空间
  const initialHeight = 40; // 减小默认高度
  
  // 添加背景
  const background = infoPanel.append('rect')
    .attr('x', -panelWidth / 2)
    .attr('y', -initialHeight / 2)
    .attr('width', panelWidth)
    .attr('height', initialHeight)
    .attr('rx', 8)
    .attr('ry', 8)
    .attr('fill', 'rgba(44, 62, 80, 0.1)')
    .attr('stroke', 'rgba(44, 62, 80, 0.2)')
    .attr('stroke-width', 1);
  
  // 减小步骤指示文本大小，并调整位置
  const stepText = infoPanel.append('text')
    .attr('x', -panelWidth / 2 + 15)
    .attr('y', 0)
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', 11 * scale) // 进一步减小字体
    .attr('font-weight', 'bold')
    .attr('fill', 'var(--primary-color)')
    .text(`步骤: ${step}`);
  
  // 获取步骤文字的实际宽度
  const stepTextWidth = stepText.node()?.getComputedTextLength() || 70;
  
  // 添加消息文本 - 减小字体尺寸
  const messageText = infoPanel.append('text')
    .attr('class', 'message-text')
    .attr('x', -panelWidth / 2 + stepTextWidth + 20) // 动态调整起始位置，基于步骤文本的宽度
    .attr('y', 0)
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', 11 * scale) // 进一步减小字体
    .attr('fill', 'var(--dark-color)')
    .text("");
  
  // 自定义中文文本换行 - 适应中文显示
  const maxLineWidth = panelWidth - stepTextWidth - 40; // 可用于消息文本的最大宽度
  
  // 将消息分成单个字符进行测量和排列
  const chars = message.split('');
  let currentLine = "";
  let lineY = 0;
  let lineHeight = 14 * scale;
  let maxLines = 1;
  
  // 添加第一行起始点
  let tspan = messageText.append('tspan')
    .attr('x', -panelWidth / 2 + stepTextWidth + 20)
    .attr('dy', 0);
  
  // 逐字符添加并检查行宽
  for (let i = 0; i < chars.length; i++) {
    currentLine += chars[i];
    tspan.text(currentLine);
    
    // 如果当前行太长，创建新行
    if (tspan.node()?.getComputedTextLength() as number > maxLineWidth && i > 0) {
      // 回退一个字符
      currentLine = currentLine.slice(0, -1);
      tspan.text(currentLine);
      
      // 创建新行开始下一个字符
      currentLine = chars[i];
      lineY += lineHeight;
      maxLines++;
      
      tspan = messageText.append('tspan')
        .attr('x', -panelWidth / 2 + stepTextWidth + 20)
        .attr('dy', lineHeight)
        .text(currentLine);
    }
  }
  
  // 根据实际行数调整背景高度
  if (maxLines > 1) {
    const newHeight = Math.max(initialHeight, lineHeight * (maxLines + 0.5));
    background.attr('height', newHeight).attr('y', -newHeight / 2);
  }
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