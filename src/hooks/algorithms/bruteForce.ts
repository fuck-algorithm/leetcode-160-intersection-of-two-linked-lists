import { VisualizationState } from '../../types';
import { Dispatch, SetStateAction } from 'react';

// 模拟暴力解法的一个步骤
export const stepBruteForce = (
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
}; 