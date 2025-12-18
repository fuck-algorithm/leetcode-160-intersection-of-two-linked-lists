import React from 'react';
import { ListNode, LinkedListData } from '../../types';
import { useAnimationEffect } from './twoPointerVisualizer/useAnimationEffect';
import TwoRowVisualizer from './TwoRowVisualizer';

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
  pointerAJumped?: boolean;
  pointerBJumped?: boolean;
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
  pointerAJumped = false,
  pointerBJumped = false,
  onAnimationComplete
}) => {
  // 使用自定义Hook处理动画效果
  useAnimationEffect(isRunning, onAnimationComplete, speed, currentNodeA, currentNodeB);

  return (
    <TwoRowVisualizer
      listA={listA}
      listB={listB}
      currentNodeA={currentNodeA}
      currentNodeB={currentNodeB}
      intersectionNode={intersectionNode}
      message={message}
      step={step}
      pointerAJumped={pointerAJumped}
      pointerBJumped={pointerBJumped}
    />
  );
};

export default D3TwoPointerVisualizer; 