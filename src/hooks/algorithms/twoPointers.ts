import { VisualizationState } from '../../types';
import { Dispatch, SetStateAction } from 'react';

// 双指针算法的一个步骤
export const stepTwoPointers = (
  state: VisualizationState,
  setState: Dispatch<SetStateAction<VisualizationState>>
): boolean => {
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
  
  return completed;
}; 