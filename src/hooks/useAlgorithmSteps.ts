/**
 * 主算法步骤钩子 - 组合所有相关的钩子来提供完整的算法步骤功能
 */
import { useStateManagement, useExampleCreation, useAutoExecution } from './algorithmSteps';

export function useAlgorithmSteps() {
  // 使用状态管理钩子
  const {
    state,
    setState,
    setStepHistory,
    setShowCreator, // 只获取setter，不需要状态
    handleChangeSolution,
    handleStepForward,
    handleStepBackward,
    handleSpeedChange,
    toggleAutoExecution,
    resetExecution,
    seekToStep
  } = useStateManagement();
  
  // 使用示例创建钩子
  const {
    openCreator,
    closeCreator,
    createRandomExample,
    createCustomExample
  } = useExampleCreation(state, setState, setStepHistory, setShowCreator);
  
  // 使用自动执行钩子
  useAutoExecution(state, setState, handleStepForward);
  
  // 返回组合后的API (不再返回showCreator状态)
  return {
    state,
    openCreator,
    closeCreator,
    createRandomExample,
    createCustomExample,
    handleStepForward,
    handleStepBackward,
    handleSpeedChange,
    toggleAutoExecution,
    resetExecution,
    handleChangeSolution,
    seekToStep
  };
} 