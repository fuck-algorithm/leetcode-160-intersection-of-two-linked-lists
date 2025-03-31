import { ListNode, LinkedListData } from '../types';

/**
 * Creates a linked list from an array of values
 */
export const createLinkedList = (values: number[]): LinkedListData => {
  if (values.length === 0) {
    return { head: null, nodes: [] };
  }

  const nodes: ListNode[] = [];
  const head = new ListNode(values[0]);
  nodes.push(head);

  let current = head;
  for (let i = 1; i < values.length; i++) {
    const newNode = new ListNode(values[i]);
    current.next = newNode;
    current = newNode;
    nodes.push(newNode);
  }

  return { head, nodes };
};

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

/**
 * Finds the intersection node using the brute force approach
 */
export const findIntersectionBruteForce = (
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null => {
  if (!headA || !headB) return null;

  let currA: ListNode | null = headA;
  while (currA) {
    let currB: ListNode | null = headB;
    while (currB) {
      if (currA === currB) {
        return currA;
      }
      currB = currB.next;
    }
    currA = currA.next;
  }

  return null;
};

/**
 * Finds the intersection node using the hash set approach
 */
export const findIntersectionHashSet = (
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null => {
  if (!headA || !headB) return null;

  const set = new Set<ListNode>();
  let currA: ListNode | null = headA;
  
  // Add all nodes from list A to the set
  while (currA) {
    set.add(currA);
    currA = currA.next;
  }

  // Check if any node in list B is in the set
  let currB: ListNode | null = headB;
  while (currB) {
    if (set.has(currB)) {
      return currB;
    }
    currB = currB.next;
  }

  return null;
};

/**
 * Finds the intersection node using the two pointer approach
 */
export const findIntersectionTwoPointers = (
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null => {
  if (!headA || !headB) return null;

  let ptrA: ListNode | null = headA;
  let ptrB: ListNode | null = headB;

  // If one pointer reaches the end, redirect it to the head of the other list
  // This way both pointers will travel the same total distance
  while (ptrA !== ptrB) {
    ptrA = ptrA ? ptrA.next : headB;
    ptrB = ptrB ? ptrB.next : headA;
  }

  // ptrA and ptrB are now either both null (no intersection) or at the intersection point
  return ptrA;
}; 