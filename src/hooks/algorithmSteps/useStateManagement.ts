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
    message: "欢迎！请点击'创建示例'按钮开始。",
    pointerAJumped: false,
    pointerBJumped: false
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
      message: `已选择 ${value} 解决方案。`,
      pointerAJumped: false,
      pointerBJumped: false
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
      message: `示例已重置。两个链表在值为 ${prev.intersection?.val || '无'} 的节点相交。`,
      pointerAJumped: false,
      pointerBJumped: false
    }));
    
    // 清空步骤历史
    setStepHistory([]);
  }, []);

  // 跳转到特定步骤
  const seekToStep = useCallback((targetStep: number) => {
    if (targetStep < 0) return;
    
    const currentStep = state.step;
    
    if (targetStep < currentStep) {
      // 向后跳转：需要从头开始重新执行到目标步骤
      // 先重置状态
      setState(prev => ({
        ...prev,
        currentNodeA: null,
        currentNodeB: null,
        visitedNodes: new Set<ListNode>(),
        step: 0,
        isRunning: false,
        completed: false,
        message: '正在跳转...',
        pointerAJumped: false,
        pointerBJumped: false
      }));
      setStepHistory([]);
      
      // 然后快速执行到目标步骤
      // 使用 setTimeout 确保状态已更新
      setTimeout(() => {
        let tempState: VisualizationState = {
          ...state,
          currentNodeA: null,
          currentNodeB: null,
          visitedNodes: new Set<ListNode>(),
          step: 0,
          completed: false,
          pointerAJumped: false,
          pointerBJumped: false
        };
        const tempHistory: StepHistory[] = [];
        
        for (let i = 0; i < targetStep; i++) {
          // 保存当前状态到历史
          tempHistory.push({
            currentNodeA: tempState.currentNodeA,
            currentNodeB: tempState.currentNodeB,
            visitedNodes: new Set(tempState.visitedNodes),
            message: tempState.message,
            completed: tempState.completed
          });
          
          // 执行一步
          const result = executeOneStep(tempState, state.solutionType);
          tempState = { ...tempState, ...result, step: i + 1 } as VisualizationState;
          
          if (result.completed) break;
        }
        
        setState(prev => ({
          ...prev,
          currentNodeA: tempState.currentNodeA,
          currentNodeB: tempState.currentNodeB,
          visitedNodes: tempState.visitedNodes,
          step: tempState.step,
          completed: tempState.completed,
          message: tempState.message,
          pointerAJumped: tempState.pointerAJumped,
          pointerBJumped: tempState.pointerBJumped
        }));
        setStepHistory(tempHistory);
      }, 0);
    } else if (targetStep > currentStep) {
      // 向前跳转：继续执行到目标步骤
      const stepsToExecute = targetStep - currentStep;
      let tempState: VisualizationState = { ...state };
      const tempHistory = [...stepHistory];
      
      for (let i = 0; i < stepsToExecute; i++) {
        if (tempState.completed) break;
        
        // 保存当前状态到历史
        tempHistory.push({
          currentNodeA: tempState.currentNodeA,
          currentNodeB: tempState.currentNodeB,
          visitedNodes: new Set(tempState.visitedNodes),
          message: tempState.message,
          completed: tempState.completed
        });
        
        // 执行一步
        const result = executeOneStep(tempState, state.solutionType);
        tempState = { ...tempState, ...result, step: tempState.step + 1 } as VisualizationState;
      }
      
      setState(prev => ({
        ...prev,
        currentNodeA: tempState.currentNodeA,
        currentNodeB: tempState.currentNodeB,
        visitedNodes: tempState.visitedNodes,
        step: tempState.step,
        completed: tempState.completed,
        message: tempState.message,
        isRunning: false,
        pointerAJumped: tempState.pointerAJumped,
        pointerBJumped: tempState.pointerBJumped
      }));
      setStepHistory(tempHistory);
    }
  }, [state, stepHistory]);

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
    resetExecution,
    seekToStep
  };
};

// 辅助函数：执行一步算法
function executeOneStep(
  currentState: VisualizationState, 
  solutionType: SolutionType
): Partial<VisualizationState> {
  // 简化版的步骤执行，返回新状态
  let ptrA = currentState.currentNodeA;
  let ptrB = currentState.currentNodeB;
  let message = '';
  let completed = false;
  let pointerAJumped = currentState.pointerAJumped || false;
  let pointerBJumped = currentState.pointerBJumped || false;
  
  // 初始化步骤
  if (currentState.step === 0) {
    ptrA = currentState.listA.head;
    ptrB = currentState.listB.head;
    pointerAJumped = false;
    pointerBJumped = false;
    message = '开始双指针解法。指针A从链表A的头节点开始，指针B从链表B的头节点开始。';
    
    // 初始化时也要检查是否已经相遇
    if (ptrA === ptrB) {
      completed = true;
      message = ptrA 
        ? `找到交点！值为${ptrA.val}的节点。` 
        : '两个链表没有交点。';
    }
    return { currentNodeA: ptrA, currentNodeB: ptrB, message, completed, pointerAJumped, pointerBJumped };
  }
  
  // 移动指针
  let newPtrA: typeof ptrA;
  let newPtrB: typeof ptrB;
  
  // 生成消息
  const msgParts: string[] = [];
  
  if (ptrA === null) {
    newPtrA = currentState.listB.head;
    pointerAJumped = true;
    msgParts.push(`指针A已经遍历完链表A，直接跳转到链表B的头节点开始第二次遍历。`);
  } else {
    newPtrA = ptrA.next;
    if (newPtrA) {
      msgParts.push(`指针A移动到值为${newPtrA.val}的节点。`);
    } else {
      msgParts.push(`指针A已经到达链表A的末尾。`);
    }
  }
  
  if (ptrB === null) {
    newPtrB = currentState.listA.head;
    pointerBJumped = true;
    msgParts.push(`指针B已经遍历完整个链表B，直接跳转到链表A的头节点开始第二次遍历。`);
  } else {
    newPtrB = ptrB.next;
    if (newPtrB) {
      msgParts.push(`指针B移动到值为${newPtrB.val}的节点。`);
    } else {
      msgParts.push(`指针B已经到达链表B的末尾。`);
    }
  }
  
  message = msgParts.join(' ');
  
  // 移动后检查是否相遇
  if (newPtrA === newPtrB) {
    completed = true;
    message = newPtrA 
      ? `找到交点！两个指针在值为${newPtrA.val}的节点相遇。` 
      : '两个链表没有交点。';
  }
  
  return { currentNodeA: newPtrA, currentNodeB: newPtrB, message, completed, pointerAJumped, pointerBJumped };
} 