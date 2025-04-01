import { useState, useCallback } from 'react';
import { ListNode, SolutionType, VisualizationState } from '../../types';
import { StepHistory } from '../types';
import { stepBruteForce } from '../algorithms/bruteForce';
import { stepHashSet } from '../algorithms/hashSet';
import { stepTwoPointers } from '../algorithms/twoPointers';

/**
 * 使用状态管理钩子 - 处理算法步骤的状态更新和历史记录
 */
export const useStateManagement = () => {
  // 主状态
  const [state, setState] = useState<VisualizationState>({
    listA: { head: null, nodes: [] },
    listB: { head: null, nodes: [] },
    currentNodeA: null,
    currentNodeB: null,
    intersection: null,
    visitedNodes: new Set<ListNode>(),
    solutionType: SolutionType.TWO_POINTERS,
    step: 0,
    isRunning: false,
    speed: 500, // 步骤之间的毫秒数
    completed: false,
    message: "欢迎！请点击'创建示例'按钮开始。"
  });
  
  // 保存步骤历史记录以支持前进/后退
  const [stepHistory, setStepHistory] = useState<StepHistory[]>([]);
  
  // 显示/隐藏创建链表对话框
  const [showCreator, setShowCreator] = useState<boolean>(false);
  
  // 改变解决方案类型
  const handleChangeSolution = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as SolutionType;
    setState(prev => ({
      ...prev,
      solutionType: value,
      step: 0,
      currentNodeA: null,
      currentNodeB: null,
      visitedNodes: new Set<ListNode>(),
      completed: false,
      message: `已选择 ${value} 解决方案。`
    }));
    
    // 重置步骤历史
    setStepHistory([]);
  }, []);

  // 模拟算法执行的一个步骤
  const handleStepForward = useCallback(() => {
    // 保存当前状态到历史记录中
    const currentHistory = {
      currentNodeA: state.currentNodeA,
      currentNodeB: state.currentNodeB,
      visitedNodes: new Set(state.visitedNodes),
      message: state.message,
      completed: state.completed
    };
    
    setStepHistory(prev => [...prev, currentHistory]);
    
    // 根据不同的算法执行相应的步骤
    let completed = false;
    
    switch (state.solutionType) {
      case SolutionType.BRUTE_FORCE:
        completed = stepBruteForce(state, setState);
        break;
      case SolutionType.HASH_SET:
        completed = stepHashSet(state, setState);
        break;
      case SolutionType.TWO_POINTERS:
        completed = stepTwoPointers(state, setState);
        break;
      default:
        // 默认使用双指针方法
        completed = stepTwoPointers(state, setState);
    }
    
    return completed;
  }, [state]);

  // 回退到前一步
  const handleStepBackward = useCallback(() => {
    if (stepHistory.length > 0) {
      const prevState = stepHistory[stepHistory.length - 1];
      
      setState(prev => ({
        ...prev,
        currentNodeA: prevState.currentNodeA,
        currentNodeB: prevState.currentNodeB,
        visitedNodes: new Set(prevState.visitedNodes),
        message: prevState.message,
        completed: prevState.completed,
        step: prev.step > 0 ? prev.step - 1 : 0,
        isRunning: false // 后退时停止自动执行
      }));
      
      // 从历史记录中移除最后一个状态
      setStepHistory(prev => prev.slice(0, -1));
    }
  }, [stepHistory]);

  // 改变执行速度
  const handleSpeedChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseInt(event.target.value);
    setState(prev => ({ ...prev, speed }));
  }, []);

  // 切换自动执行
  const toggleAutoExecution = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  // 重置执行状态
  const resetExecution = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentNodeA: null,
      currentNodeB: null,
      visitedNodes: new Set<ListNode>(),
      step: 0,
      isRunning: false,
      completed: false,
      message: `示例已重置。两个链表在值为 ${prev.intersection?.val || '无'} 的节点相交。`
    }));
    
    // 清空步骤历史
    setStepHistory([]);
  }, []);

  return {
    state,
    setState,
    stepHistory,
    setStepHistory,
    showCreator,
    setShowCreator,
    handleChangeSolution,
    handleStepForward,
    handleStepBackward,
    handleSpeedChange,
    toggleAutoExecution,
    resetExecution
  };
}; 