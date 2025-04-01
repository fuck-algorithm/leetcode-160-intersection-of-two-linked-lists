// D3可视化器的布局配置参数

// 计算布局参数
export const calculateLayoutParams = (
  containerWidth: number,
  containerHeight: number,
  totalNodes: number
) => {
  // 视图框配置
  const viewBoxWidth = 1800;
  const viewBoxHeight = 800; // 从500增加到800，提供更多垂直空间
  
  // 边距设置
  const leftMargin = 80;
  const rightMargin = 0;
  const usableWidth = viewBoxWidth - leftMargin - rightMargin;
  
  // 缩放比例
  const scale = Math.min(containerWidth / 1000, containerHeight / 800); // 更新缩放比例
  const nodeRadius = Math.max(18, Math.min(22, 22 * scale));
  const fontSize = Math.max(24, Math.min(28, 28 * scale)); // 将字体大小从16增加到28
  
  // 垂直位置 - 更新位置以给顶部信息面板留出空间
  const topMargin = 150; // 顶部留出150px给信息面板
  const topRowY = topMargin + viewBoxHeight * 0.2;  // 链表A下移，确保不与信息面板重叠
  const bottomRowY = topMargin + viewBoxHeight * 0.7; // 链表B也相应下移
  const intersectionRowY = topMargin + viewBoxHeight * 0.45; // 相交部分位于两链表之间
  
  // 计算节点间距
  let nodeSpacing;
  if (totalNodes <= 1) {
    nodeSpacing = 100; // 默认间距
  } else {
    // 计算总节点直径
    const totalNodeDiameter = nodeRadius * 2 * totalNodes;
    // 计算可用的间距总长度
    const totalSpacingAvailable = usableWidth - totalNodeDiameter;
    // 每个间距的长度 (间距数量为节点数-1)
    nodeSpacing = totalSpacingAvailable / (totalNodes - 1);
    // 确保最小间距不会小于节点本身
    nodeSpacing = Math.max(nodeSpacing, nodeRadius * 2.2);
  }
  
  return {
    viewBoxWidth,
    viewBoxHeight,
    leftMargin,
    rightMargin,
    scale,
    nodeRadius,
    fontSize,
    topRowY,
    bottomRowY,
    intersectionRowY,
    nodeSpacing,
    leftOffset: leftMargin
  };
}; 