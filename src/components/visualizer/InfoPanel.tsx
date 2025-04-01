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
  
  // 创建一个顶层容器，确保面板显示在最上面
  const topLevelContainer = svg.append('g')
    .attr('class', 'top-level-container')
    .attr('pointer-events', 'none'); // 避免阻挡链表交互
  
  // 创建固定位置信息面板，完全独立于链表显示区域
  const infoPanel = topLevelContainer.append('g')
    .attr('class', 'info-panel')
    .attr('transform', `translate(${viewBoxWidth * 0.5}, 60)`);
  
  // 计算面板宽度 - 确保足够宽以容纳所有文本
  const panelWidth = Math.min(viewBoxWidth - 40, Math.max(800, viewBoxWidth * 0.8)); 
  const initialHeight = 80;
  
  // 添加背景 - 使用更醒目的样式确保可见性
  const background = infoPanel.append('rect')
    .attr('x', -panelWidth / 2)
    .attr('y', -initialHeight / 2)
    .attr('width', panelWidth)
    .attr('height', initialHeight)
    .attr('rx', 12)
    .attr('ry', 12)
    .attr('fill', 'rgba(255, 255, 255, 0.95)') // 近乎不透明的白色背景
    .attr('stroke', 'rgba(44, 62, 80, 0.6)') // 更深的边框颜色
    .attr('stroke-width', 2.5); // 更粗的边框
  
  // 添加步骤指示文本
  const stepText = infoPanel.append('text')
    .attr('x', -panelWidth / 2 + 20)
    .attr('y', 0)
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', 26 * scale) // 增大字体
    .attr('font-weight', 'bold')
    .attr('fill', '#2980b9') // 使用更醒目的蓝色
    .text(`步骤: ${step}`);
  
  // 获取步骤文字的实际宽度
  const stepTextWidth = stepText.node()?.getComputedTextLength() || 90;
  
  // 处理消息中的特殊值（例如将"null"或"undefined"替换为"无"）
  let processedMessage = message;
  if (typeof message === 'string') {
    processedMessage = message
      .replace(/值为\s*null\s*的/g, '值为 无 的')
      .replace(/值为\s*undefined\s*的/g, '值为 无 的')
      .replace(/值为\s*"null"\s*的/g, '值为 无 的')
      .replace(/值为\s*"undefined"\s*的/g, '值为 无 的');
  }
  
  // 添加消息文本
  const messageText = infoPanel.append('text')
    .attr('class', 'message-text')
    .attr('x', -panelWidth / 2 + stepTextWidth + 25)
    .attr('y', 0)
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', 24 * scale)
    .attr('fill', '#333')
    .text("");
  
  // 自定义中文文本换行 - 适应中文显示
  const maxLineWidth = panelWidth - stepTextWidth - 50;
  
  // 将消息分成单个字符进行测量和排列
  const chars = processedMessage.split('');
  let currentLine = "";
  let lineY = 0;
  let lineHeight = 28 * scale;
  let maxLines = 1;
  let maxTextWidth = 0; // 跟踪最宽行的宽度
  
  // 添加第一行起始点
  let tspan = messageText.append('tspan')
    .attr('x', -panelWidth / 2 + stepTextWidth + 25)
    .attr('dy', 0);
  
  // 逐字符添加并检查行宽
  for (let i = 0; i < chars.length; i++) {
    currentLine += chars[i];
    tspan.text(currentLine);
    
    const currentWidth = tspan.node()?.getComputedTextLength() || 0;
    maxTextWidth = Math.max(maxTextWidth, currentWidth);
    
    // 如果当前行太长，创建新行
    if (currentWidth > maxLineWidth && i > 0) {
      // 回退一个字符
      currentLine = currentLine.slice(0, -1);
      tspan.text(currentLine);
      
      // 创建新行开始下一个字符
      currentLine = chars[i];
      lineY += lineHeight;
      maxLines++;
      
      tspan = messageText.append('tspan')
        .attr('x', -panelWidth / 2 + stepTextWidth + 25)
        .attr('dy', lineHeight)
        .text(currentLine);
    }
  }
  
  // 根据实际行数调整背景高度
  if (maxLines > 1) {
    const newHeight = Math.max(initialHeight, lineHeight * (maxLines + 0.5));
    background.attr('height', newHeight).attr('y', -newHeight / 2);
  }
  
  // 调整面板宽度，确保能容纳所有文本
  const totalTextWidth = stepTextWidth + maxTextWidth + 50;
  if (totalTextWidth > panelWidth) {
    const newWidth = Math.min(viewBoxWidth - 40, totalTextWidth);
    background.attr('width', newWidth).attr('x', -newWidth / 2);
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
    .attr('transform', `translate(${viewBoxWidth * 0.85}, ${viewBoxHeight * 0.2})`);
  
  // 调整背景大小和位置
  algorithmPanel.append('rect')
    .attr('x', -200)
    .attr('y', -60) // 增大高度以适应更大的字体
    .attr('width', 400) // 增大宽度
    .attr('height', 150) // 增大高度
    .attr('rx', 12) // 增大圆角
    .attr('ry', 12) // 增大圆角
    .attr('fill', 'rgba(52, 152, 219, 0.1)')
    .attr('stroke', 'rgba(52, 152, 219, 0.3)')
    .attr('stroke-width', 1.5); // 增加边框粗细
  
  // 添加说明标题
  algorithmPanel.append('text')
    .attr('x', -190)
    .attr('y', -25)
    .attr('text-anchor', 'start')
    .attr('font-size', 20 * scale) // 增大标题字体
    .attr('font-weight', 'bold')
    .attr('fill', 'var(--primary-color)')
    .text('双指针解法说明:');
  
  // 添加说明文本，调整位置和行间距
  const explanationText = algorithmPanel.append('text')
    .attr('x', -190)
    .attr('y', 0)
    .attr('text-anchor', 'start')
    .attr('font-size', 18 * scale) // 增大说明文本字体
    .attr('fill', 'var(--dark-color)')
    .text('指针A和指针B分别从两个链表的头部开始，当一个指针到达链表末尾时，');
  
  explanationText.append('tspan')
    .attr('x', -190)
    .attr('dy', 25) // 增大行间距
    .text('直接跳转到另一个链表的头部。当两个指针相遇时，他们要么都在');
  
  explanationText.append('tspan')
    .attr('x', -190)
    .attr('dy', 25) // 增大行间距
    .text('交点处（相交），要么都不相遇（无交点）。');
}; 