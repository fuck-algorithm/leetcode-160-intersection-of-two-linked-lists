import { useCallback } from 'react';
import { ListNode, VisualizationState } from '../../types';
import { createIntersectingLists } from '../../utils/linkedListUtils';
import { generateRandomArray } from '../algorithmHelpers';

/**
 * 示例创建钩子 - 处理创建各种链表示例的逻辑
 */
export const useExampleCreation = (
  state: VisualizationState,
  setState: React.Dispatch<React.SetStateAction<VisualizationState>>,
  setStepHistory: React.Dispatch<React.SetStateAction<any[]>>,
  setShowCreator: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // 打开创建对话框 - 直接设置状态，不使用回调
  const openCreator = () => {
    console.log('openCreator直接设置showCreator为true');
    setShowCreator(true);
  };
  
  // 关闭创建对话框 - 直接设置状态，不使用回调
  const closeCreator = () => {
    console.log('closeCreator直接设置showCreator为false');
    setShowCreator(false);
  };
  
  // 创建随机示例
  const createRandomExample = useCallback((customCreateFn?: (valuesA: number[], valuesB: number[], intersectionValues: number[]) => void) => {
    // 使用固定长度，不再随机生成，确保每次创建的示例长度一致
    const listALength = 3; // 固定为3个节点
    const listBLength = 3; // 固定为3个节点
    const intersectionLength = 2; // 固定为2个节点
    
    const valuesA = generateRandomArray(listALength);
    const valuesB = generateRandomArray(listBLength);
    const intersectionValues = generateRandomArray(intersectionLength);
    
    // 如果提供了自定义创建函数，使用它；否则使用内部的createCustomExample
    if (customCreateFn) {
      customCreateFn(valuesA, valuesB, intersectionValues);
    }
  }, []);
  
  // 创建自定义示例
  const createCustomExample = useCallback((
    valuesA: number[], 
    valuesB: number[], 
    intersectionValues: number[]
  ) => {
    console.log('createCustomExample开始执行:', { valuesA, valuesB, intersectionValues });
    
    try {
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
      console.log('createCustomExample即将设置showCreator为false');
      setShowCreator(false);
      console.log('createCustomExample已设置showCreator为false');
    } catch (error) {
      console.error('创建自定义示例时出错:', error);
    }
  }, [state.solutionType, state.speed, setState, setStepHistory, setShowCreator]);

  return {
    openCreator,
    closeCreator,
    createRandomExample,
    createCustomExample
  };
}; 