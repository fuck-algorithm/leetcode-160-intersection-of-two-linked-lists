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
  let newMessage = state.message;
  let completed = state.completed;
  // 跟踪指针是否已经跳转
  let pointerAJumped = state.pointerAJumped || false;
  let pointerBJumped = state.pointerBJumped || false;
  
  // 第一步 - 初始化
  if (step === 0) {
    nextNodeA = listA.head;
    nextNodeB = listB.head;
    nextStep = 1;
    pointerAJumped = false;
    pointerBJumped = false;
    newMessage = "开始双指针解法。指针A从链表A的头节点开始，指针B从链表B的头节点开始。";
    
    // 初始化时也要检查是否已经相遇（比如两个链表头节点就是交点）
    if (nextNodeA === nextNodeB) {
      completed = true;
      newMessage = nextNodeA 
        ? `找到交点！值为${nextNodeA.val}的节点。` 
        : "使用双指针方法确定两个链表没有交点。";
    }
  } 
  // 移动指针
  else {
    // 先移动指针A
    if (nextNodeA === null) {
      nextNodeA = listB.head;
      pointerAJumped = true;  // 标记指针A已经跳转
      newMessage = "指针A已经遍历完整个链表A，直接跳转到链表B的头节点开始第二次遍历。";
    } else {
      nextNodeA = nextNodeA.next;
      newMessage = nextNodeA 
        ? `指针A移动到值为${nextNodeA.val}的节点。` 
        : "指针A已经到达链表A的末尾。";
    }
    
    // 再移动指针B
    if (nextNodeB === null) {
      nextNodeB = listA.head;
      pointerBJumped = true;  // 标记指针B已经跳转
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
    
    // 移动后检查是否相遇
    if (nextNodeA === nextNodeB) {
      completed = true;
      newMessage = nextNodeA 
        ? `找到交点！两个指针在值为${nextNodeA.val}的节点相遇。` 
        : "使用双指针方法确定两个链表没有交点。";
    }
  }

  // 更新状态
  setState(prev => ({
    ...prev,
    currentNodeA: nextNodeA,
    currentNodeB: nextNodeB,
    step: nextStep,
    visitedNodes: new Set(visitedNodes),
    completed,
    message: newMessage,
    pointerAJumped,
    pointerBJumped
  }));
  
  return completed;
}; 