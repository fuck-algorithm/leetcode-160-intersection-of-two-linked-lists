import { useEffect } from 'react';
import { ListNode } from '../../../types';

// 自定义Hook处理动画效果
export const useAnimationEffect = (
  isRunning: boolean,
  onAnimationComplete: (() => void) | undefined,
  speed: number,
  currentNodeA: ListNode | null,
  currentNodeB: ListNode | null
) => {
  useEffect(() => {
    if (isRunning && onAnimationComplete) {
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentNodeA, currentNodeB, isRunning, onAnimationComplete, speed]);
}; 