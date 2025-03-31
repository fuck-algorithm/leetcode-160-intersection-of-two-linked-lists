import { useState, useCallback, useEffect } from 'react';
import { ListNode, LinkedListData, SolutionType, VisualizationState } from '../types';
import { createIntersectingLists } from '../utils/linkedListUtils';

// 保存算法执行的历史记录，用于前进/后退功能
interface StepHistory {
  currentNodeA: ListNode | null;
  currentNodeB: ListNode | null;
  visitedNodes: Set<ListNode>;
  message: string;
  completed: boolean;
}

// 生成随机数字数组
const generateRandomArray = (length: number): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * 20) + 1);
};

export function useAlgorithmSteps() {
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
  
  // 创建随机示例
  const createRandomExample = useCallback(() => {
    // 生成随机长度和随机值
    const listALength = Math.floor(Math.random() * 3) + 1; // 1-3个节点
    const listBLength = Math.floor(Math.random() * 3) + 1; // 1-3个节点
    const intersectionLength = Math.floor(Math.random() * 3) + 1; // 1-3个节点
    
    const valuesA = generateRandomArray(listALength);
    const valuesB = generateRandomArray(listBLength);
    const intersectionValues = generateRandomArray(intersectionLength);
    
    createCustomExample(valuesA, valuesB, intersectionValues);
  }, []);
  
  // 创建自定义示例
  const createCustomExample = useCallback((
    valuesA: number[], 
    valuesB: number[], 
    intersectionValues: number[]
  ) => {
    const { listA, listB, intersection } = createIntersectingLists(
      valuesA,
      valuesB,
      intersectionValues
    );
    
    setState({
      listA,
      listB,
      currentNodeA: null,
      currentNodeB: null,
      intersection,
      visitedNodes: new Set<ListNode>(),
      solutionType: state.solutionType,
      step: 0,
      isRunning: false,
      speed: state.speed,
      completed: false,
      message: `示例已创建。两个链表在值为 ${intersection?.val || '无'} 的节点相交。`
    });
    
    // 重置步骤历史
    setStepHistory([]);
    
    // 隐藏创建对话框
    setShowCreator(false);
  }, [state.solutionType, state.speed]);
  
  // 打开创建对话框
  const openCreator = useCallback(() => {
    setShowCreator(true);
  }, []);
  
  // 关闭创建对话框
  const closeCreator = useCallback(() => {
    setShowCreator(false);
  }, []);
  
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

  // 模拟暴力解法的一个步骤
  const stepBruteForce = useCallback(() => {
    const { listA, listB, currentNodeA, currentNodeB, step, visitedNodes } = state;
    let nextNodeA = currentNodeA;
    let nextNodeB = currentNodeB;
    let nextStep = step;
    let foundIntersection = null;
    let newMessage = state.message;
    let completed = state.completed;
    
    // 第一步 - 初始化
    if (step === 0) {
      nextNodeA = listA.head;
      nextNodeB = listB.head;
      nextStep = 1;
      newMessage = "开始暴力搜索。检查链表A中的每个节点是否与链表B中的任何节点相同。";
    } 
    // 主要算法步骤
    else {
      // 如果已经检查完链表B中的所有节点，移动到链表A中的下一个节点
      if (nextNodeB === null || nextNodeB.next === null) {
        if (nextNodeA === null) {
          // 已经遍历完两个链表，没有找到交点
          completed = true;
          newMessage = "使用暴力方法未找到交点。";
        } else {
          // 移动到链表A中的下一个节点，重新开始链表B
          nextNodeA = nextNodeA.next;
          nextNodeB = listB.head;
          nextStep++;
          newMessage = nextNodeA 
            ? `移动到链表A中的下一个节点(${nextNodeA.val})并重新开始检查链表B。` 
            : "已到达链表A的末尾，未找到交点。";
        }
      } else {
        // 继续使用当前链表A节点，移动到链表B中的下一个节点
        nextNodeB = nextNodeB.next;
        nextStep++;
        newMessage = `正在检查节点A(${nextNodeA?.val})与节点B(${nextNodeB?.val})是否相同。`;
      }

      // 检查是否有交点
      if (nextNodeA && nextNodeB && nextNodeA === nextNodeB) {
        foundIntersection = nextNodeA;
        completed = true;
        newMessage = `找到交点！值为${foundIntersection.val}的节点。`;
      }

      // 将当前节点添加到已访问节点集合中用于可视化
      if (nextNodeA) visitedNodes.add(nextNodeA);
      if (nextNodeB) visitedNodes.add(nextNodeB);
    }

    setState({
      ...state,
      currentNodeA: nextNodeA,
      currentNodeB: nextNodeB,
      step: nextStep,
      visitedNodes: new Set(visitedNodes),
      completed,
      message: newMessage
    });

    return completed;
  }, [state]);

  // 模拟哈希集合方法的一个步骤
  const stepHashSet = useCallback(() => {
    const { listA, listB, currentNodeA, currentNodeB, step, visitedNodes } = state;
    let nextNodeA = currentNodeA;
    let nextNodeB = currentNodeB;
    let nextStep = step;
    let foundIntersection = null;
    let newMessage = state.message;
    let completed = state.completed;
    
    // 第一步 - 初始化
    if (step === 0) {
      nextNodeA = listA.head;
      nextStep = 1;
      newMessage = "开始哈希集合方法。首先，我们将链表A中的所有节点添加到集合中。";
    } 
    // 将链表A中的所有节点添加到集合中
    else if (nextNodeA !== null) {
      visitedNodes.add(nextNodeA);
      nextNodeA = nextNodeA.next;
      nextStep++;
      newMessage = nextNodeA 
        ? `已将节点A(${state.currentNodeA?.val})添加到集合中。移动到下一个节点。` 
        : "已将链表A中的所有节点添加到集合中。现在检查链表B。";
      
      if (nextNodeA === null) {
        nextNodeB = listB.head;
      }
    } 
    // 检查链表B中的节点是否在集合中
    else if (nextNodeB !== null) {
      // 检查链表B中的这个节点是否在集合中（意味着它也在链表A中）
      if (visitedNodes.has(nextNodeB)) {
        foundIntersection = nextNodeB;
        completed = true;
        newMessage = `找到交点！值为${foundIntersection.val}的节点。`;
      } else {
        nextNodeB = nextNodeB.next;
        nextStep++;
        newMessage = nextNodeB 
          ? `节点B(${state.currentNodeB?.val})不在集合中。移动到下一个节点。` 
          : "已检查链表B中的所有节点。未找到交点。";
        
        if (nextNodeB === null) {
          completed = true;
          newMessage = "使用哈希集合方法未找到交点。";
        }
      }
    }

    setState({
      ...state,
      currentNodeA: nextNodeA,
      currentNodeB: nextNodeB,
      step: nextStep,
      visitedNodes: new Set(visitedNodes),
      completed,
      message: newMessage
    });

    return completed;
  }, [state]);

  // 双指针算法的一个步骤
  const stepTwoPointers = useCallback(() => {
    const { listA, listB, currentNodeA, currentNodeB, step, visitedNodes } = state;
    let nextNodeA = currentNodeA;
    let nextNodeB = currentNodeB;
    let nextStep = step;
    let foundIntersection = null;
    let newMessage = state.message;
    let completed = state.completed;
    
    // 保存当前步骤到历史记录
    const currentState: StepHistory = {
      currentNodeA,
      currentNodeB,
      visitedNodes: new Set(visitedNodes),
      message: state.message,
      completed: state.completed
    };
    
    // 第一步 - 初始化
    if (step === 0) {
      nextNodeA = listA.head;
      nextNodeB = listB.head;
      nextStep = 1;
      newMessage = "开始双指针解法。指针A从链表A的头节点开始，指针B从链表B的头节点开始。";
    } 
    // 检查指针是否相遇
    else if (nextNodeA === nextNodeB) {
      foundIntersection = nextNodeA;
      completed = true;
      newMessage = nextNodeA 
        ? `找到交点！值为${nextNodeA.val}的节点。` 
        : "使用双指针方法确定两个链表没有交点。";
    }
    // 移动指针
    else {
      // 移动指针A
      if (nextNodeA === null) {
        nextNodeA = listB.head;
        newMessage = "指针A已经遍历完整个链表A，直接跳转到链表B的头节点开始第二次遍历。";
      } else {
        nextNodeA = nextNodeA.next;
        newMessage = nextNodeA 
          ? `指针A移动到值为${nextNodeA.val}的节点。` 
          : "指针A已经到达链表A的末尾。";
      }
      
      // 移动指针B
      if (nextNodeB === null) {
        nextNodeB = listA.head;
        newMessage += " 指针B已经遍历完整个链表B，直接跳转到链表A的头节点开始第二次遍历。";
      } else {
        nextNodeB = nextNodeB.next;
        newMessage += nextNodeB 
          ? ` 指针B移动到值为${nextNodeB.val}的节点。` 
          : " 指针B已经到达链表B的末尾。";
      }
      
      nextStep++;
      
      // 将当前节点添加到已访问节点集合中用于可视化
      if (nextNodeA) visitedNodes.add(nextNodeA);
      if (nextNodeB) visitedNodes.add(nextNodeB);
    }

    // 更新状态
    setState(prev => ({
      ...prev,
      currentNodeA: nextNodeA,
      currentNodeB: nextNodeB,
      step: nextStep,
      visitedNodes: new Set(visitedNodes),
      completed,
      message: newMessage
    }));
    
    // 添加新步骤到历史记录
    setStepHistory(prev => [...prev, currentState]);

    return completed;
  }, [state]);

  // 执行前进一步
  const stepForward = useCallback((): boolean => {
    // 如果已完成算法，则直接返回true
    if (state.completed) return true;
    
    return stepTwoPointers();
  }, [state, stepTwoPointers]);
  
  // 执行后退一步
  const stepBackward = useCallback(() => {
    // 只有在有历史记录且当前步骤大于0时才能后退
    if (stepHistory.length > 0 && state.step > 0) {
      // 移除最后一个历史记录，并还原到前一个状态
      const newHistory = [...stepHistory];
      const previousState = newHistory.pop();
      
      if (previousState) {
        setState(prev => ({
          ...prev,
          currentNodeA: previousState.currentNodeA,
          currentNodeB: previousState.currentNodeB,
          visitedNodes: new Set(previousState.visitedNodes),
          step: prev.step - 1,
          completed: previousState.completed,
          message: previousState.message
        }));
        
        setStepHistory(newHistory);
      }
    }
  }, [state.step, stepHistory]);

  // 单步前进
  const handleStepForward = useCallback(() => {
    if (!state.completed) {
      stepForward();
    }
  }, [state.completed, stepForward]);
  
  // 单步后退
  const handleStepBackward = useCallback(() => {
    if (state.step > 0) {
      stepBackward();
    }
  }, [state.step, stepBackward]);

  // 处理速度变化
  const handleSpeedChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      speed: parseInt(event.target.value)
    }));
  }, []);
  
  // 开始或停止自动执行
  const toggleAutoExecution = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: !prev.isRunning
    }));
  }, []);

  // 重置可视化
  const resetExecution = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentNodeA: null,
      currentNodeB: null,
      visitedNodes: new Set<ListNode>(),
      step: 0,
      isRunning: false,
      completed: false,
      message: `已重置${prev.solutionType}解决方案。`
    }));
    
    // 重置步骤历史
    setStepHistory([]);
  }, []);

  // 自动执行逻辑
  useEffect(() => {
    let timeoutId: number | null = null;
    
    const runStep = () => {
      if (state.isRunning && !state.completed) {
        stepForward();
        timeoutId = window.setTimeout(runStep, state.speed);
      }
    };
    
    if (state.isRunning && !state.completed) {
      timeoutId = window.setTimeout(runStep, state.speed);
    }
    
    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [state.isRunning, state.completed, state.speed, stepForward]);

  // 返回状态和操作函数
  return {
    state,
    showCreator,
    openCreator,
    closeCreator,
    createRandomExample,
    createCustomExample,
    handleChangeSolution,
    handleStepForward,
    handleStepBackward,
    handleSpeedChange,
    toggleAutoExecution,
    resetExecution
  };
} 