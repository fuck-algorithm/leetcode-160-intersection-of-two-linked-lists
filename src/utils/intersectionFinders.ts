import { ListNode } from '../types';

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