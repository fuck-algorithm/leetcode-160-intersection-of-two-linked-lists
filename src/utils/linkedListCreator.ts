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