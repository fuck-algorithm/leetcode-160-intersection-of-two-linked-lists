import React from 'react';
import LinkedListVisualizer from './LinkedListVisualizer';
import { ListNode, LinkedListData } from '../types';

interface LinkedListAdapterProps {
  listA: LinkedListData;
  listB: LinkedListData;
  currentNodeA: ListNode | null;
  currentNodeB: ListNode | null;
  intersectionNode: ListNode | null;
}

const LinkedListAdapter: React.FC<LinkedListAdapterProps> = ({
  listA,
  listB,
  currentNodeA,
  currentNodeB,
  intersectionNode,
}) => {
  return (
    <div className="linked-list-container">
      <LinkedListVisualizer 
        linkedList={listA}
        currentNode={currentNodeA}
        intersectionNode={intersectionNode}
        label="链表 A"
      />
      <LinkedListVisualizer 
        linkedList={listB}
        currentNode={currentNodeB}
        intersectionNode={intersectionNode}
        label="链表 B"
      />
    </div>
  );
};

export default LinkedListAdapter; 