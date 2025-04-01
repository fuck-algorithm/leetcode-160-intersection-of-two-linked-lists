import { VisualizationState } from '../../types';
import { Dispatch, SetStateAction } from 'react';

// 模拟哈希集合方法的一个步骤
export const stepHashSet = (
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
}; 