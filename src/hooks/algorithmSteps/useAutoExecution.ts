import { useEffect } from 'react';
import { VisualizationState } from '../../types';

/**
 * 自动执行钩子 - 处理算法步骤的自动运行
 */
export const useAutoExecution = (
  state: VisualizationState,
  setState: React.Dispatch<React.SetStateAction<VisualizationState>>,
  handleStepForward: () => boolean
) => {
  // 自动执行逻辑
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    
    const runStep = () => {
      const completed = handleStepForward();
      if (!completed && state.isRunning) {
        timer = setTimeout(runStep, state.speed);
      } else if (completed) {
        setState(prev => ({ ...prev, isRunning: false }));
      }
    };
    
    if (state.isRunning && !state.completed && state.listA.nodes.length > 0) {
      timer = setTimeout(runStep, state.speed);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [
    state.isRunning, 
    state.completed, 
    state.speed, 
    state.listA.nodes.length, 
    handleStepForward,
    setState
  ]);
}; 