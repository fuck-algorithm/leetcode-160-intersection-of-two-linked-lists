import React from 'react';
import LinkedListNode from './LinkedListNode';
import { ListNode, LinkedListData } from '../types';

interface LinkedListVisualizerProps {
  linkedList: LinkedListData;
  currentNode: ListNode | null;
  intersectionNode: ListNode | null;
  label: string;
}

const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({
  linkedList,
  currentNode,
  intersectionNode,
  label
}) => {
  return (
    <div>
      <h3>{label}</h3>
      <div className="linked-list">
        {linkedList.nodes.map((node, index) => (
          <LinkedListNode
            key={index}
            node={node}
            isCurrent={node === currentNode}
            isIntersection={node === intersectionNode}
            isLast={index === linkedList.nodes.length - 1 || node.next === null}
          />
        ))}
        {linkedList.nodes.length === 0 && <div>Empty list</div>}
      </div>
    </div>
  );
};

export default LinkedListVisualizer; 