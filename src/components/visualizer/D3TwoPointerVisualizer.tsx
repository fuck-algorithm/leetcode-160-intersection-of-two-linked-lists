import React, { useRef, useEffect } from 'react';
import { ListNode, LinkedListData } from '../../types';
import { useContainerSize } from './twoPointerVisualizer/useContainerSize';
import { renderVisualizer } from './twoPointerVisualizer/renderManager/renderVisualizer';
import { useAnimationEffect } from './twoPointerVisualizer/useAnimationEffect';

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
  const d3Container = useRef<HTMLDivElement>(null);
  const containerSize = useContainerSize(d3Container);
  
  // 使用自定义Hook处理动画效果
  useAnimationEffect(isRunning, onAnimationComplete, speed, currentNodeA, currentNodeB);
  
  // 渲染可视化内容
  useEffect(() => {
    if (d3Container.current) {
      renderVisualizer(
        d3Container.current,
        containerSize,
        listA,
        listB,
        currentNodeA,
        currentNodeB,
        intersectionNode,
        message,
        step
      );
    }
  }, [
    listA, 
    listB, 
    currentNodeA, 
    currentNodeB, 
    intersectionNode, 
    containerSize,
    message,
    step
  ]);

  return (
    <div className="d3-container-wrapper">
      <div className="d3-visualization-container" ref={d3Container}></div>
    </div>
  );
};

export default D3TwoPointerVisualizer; 