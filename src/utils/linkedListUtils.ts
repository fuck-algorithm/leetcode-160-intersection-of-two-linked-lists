import { ListNode, LinkedListData } from '../types';
import { createLinkedList } from './linkedListCreator';
import { 
  findIntersectionBruteForce, 
  findIntersectionHashSet, 
  findIntersectionTwoPointers 
} from './intersectionFinders';

/**
 * Creates two linked lists with an intersection
 */
export const createIntersectingLists = (
  valuesA: number[],
  valuesB: number[],
  intersectionValues: number[]
): { listA: LinkedListData; listB: LinkedListData; intersection: ListNode | null } => {
  // Create the intersection part first
  const intersectionData = createLinkedList(intersectionValues);
  const intersection = intersectionData.head;

  // Create list A (excluding intersection)
  const listAData = createLinkedList(valuesA);
  const listA = listAData.head;

  // Create list B (excluding intersection)
  const listBData = createLinkedList(valuesB);
  const listB = listBData.head;

  // Connect list A to intersection
  if (listA && intersection) {
    let tail = listA;
    while (tail.next) {
      tail = tail.next;
    }
    tail.next = intersection;
  }

  // Connect list B to intersection
  if (listB && intersection) {
    let tail = listB;
    while (tail.next) {
      tail = tail.next;
    }
    tail.next = intersection;
  }

  // Create complete node lists
  const nodesA = listA ? [...listAData.nodes] : [];
  const nodesB = listB ? [...listBData.nodes] : [];
  
  if (intersection) {
    nodesA.push(...intersectionData.nodes);
    nodesB.push(...intersectionData.nodes);
  }

  return {
    listA: { head: listA, nodes: nodesA },
    listB: { head: listB, nodes: nodesB },
    intersection
  };
};

// Re-export the functions from other files for backward compatibility
export { 
  createLinkedList,
  findIntersectionBruteForce,
  findIntersectionHashSet,
  findIntersectionTwoPointers
}; 