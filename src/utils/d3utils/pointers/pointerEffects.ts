import * as d3 from 'd3';

/**
 * 添加指针移动动画效果 - 从一个节点移动到另一个节点的可视化效果
 */
export const addPointerMoveEffect = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  scale: number = 1,
  duration: number = 700
) => {
  // 创建路径
  const pathData = `M${fromX},${fromY} C${fromX},${fromY-40*scale} ${toX},${toY-40*scale} ${toX},${toY}`;
  
  // 添加轨迹路径（隐藏）
  const path = svg.append('path')
    .attr('d', pathData)
    .attr('stroke', 'none')
    .attr('fill', 'none')
    .attr('id', `pointer-path-${Math.random().toString(36).substr(2, 9)}`);
  
  // 创建移动圆点的组
  const movingPointer = svg.append('g')
    .attr('class', 'moving-pointer')
    .attr('opacity', 0);
  
  // 添加圆形指示器
  movingPointer.append('circle')
    .attr('r', 5 * scale)
    .attr('fill', color);
  
  // 添加轨迹线
  const trail = movingPointer.append('path')
    .attr('d', 'M0,0 L0,0')
    .attr('stroke', color)
    .attr('stroke-width', 2 * scale)
    .attr('stroke-dasharray', '3,2')
    .attr('opacity', 0.5);
  
  // 添加沿着路径的动画
  const totalLength = path.node()?.getTotalLength() || 0;
  let currentPoint = [fromX, fromY];
  let pathPoints: [number, number][] = [];
  
  // 渐变显示
  movingPointer.transition()
    .duration(100)
    .attr('opacity', 1)
    .on('end', function() {
      // 沿路径移动的动画
      d3.select(this)
        .transition()
        .duration(duration)
        .attrTween('transform', function() {
          return function(t: number) {
            // 获取当前路径上的点
            const point = path.node()?.getPointAtLength(t * totalLength);
            if (point) {
              // 记录路径点
              pathPoints.push([point.x, point.y]);
              
              // 更新轨迹线
              if (pathPoints.length > 1) {
                const lineData = d3.line()(pathPoints);
                trail.attr('d', lineData || '');
              }
              
              currentPoint = [point.x, point.y];
              return `translate(${point.x},${point.y})`;
            }
            return '';
          };
        })
        .on('end', function() {
          // 动画结束后淡出
          d3.select(this)
            .transition()
            .duration(200)
            .attr('opacity', 0)
            .remove();
            
          // 移除路径元素
          path.remove();
        });
    });
    
  return movingPointer;
};

/**
 * 添加指针相交动画效果 - 当两个指针在同一节点相遇时使用
 */
export const addPointersIntersectEffect = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number,
  y: number,
  nodeRadius: number,
  scale: number = 1
) => {
  // 1. 添加一个大的圆形波纹效果
  const ripple = svg.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', nodeRadius)
    .attr('fill', 'none')
    .attr('stroke', '#f1c40f')
    .attr('stroke-width', 2 * scale)
    .attr('opacity', 1);
    
  // 2. 添加波纹扩散动画
  ripple.transition()
    .duration(1000)
    .attr('r', nodeRadius * 3)
    .attr('opacity', 0)
    .on('end', function() {
      d3.select(this).remove();
    });
    
  // 3. 添加星星爆炸效果
  const numStars = 8;
  const starGroup = svg.append('g');
  
  for (let i = 0; i < numStars; i++) {
    const angle = (i / numStars) * Math.PI * 2;
    const startX = x;
    const startY = y;
    const endX = x + Math.cos(angle) * nodeRadius * 4;
    const endY = y + Math.sin(angle) * nodeRadius * 4;
    
    const star = starGroup.append('path')
      .attr('d', 'M0,-5L2,-2L5,-2L3,1L4,4L0,2L-4,4L-3,1L-5,-2L-2,-2Z')
      .attr('fill', '#f39c12')
      .attr('transform', `translate(${startX}, ${startY}) scale(${0.8 * scale})`)
      .attr('opacity', 1);
      
    star.transition()
      .duration(800)
      .attr('transform', `translate(${endX}, ${endY}) scale(${0.2 * scale}) rotate(${180 + i * 45})`)
      .attr('opacity', 0)
      .on('end', function() {
        d3.select(this).remove();
      });
  }
  
  return svg;
}; 