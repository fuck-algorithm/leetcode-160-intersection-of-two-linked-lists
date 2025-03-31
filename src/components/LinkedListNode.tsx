import React from 'react';
import { ListNode } from '../types';

interface LinkedListNodeProps {
  node: ListNode;
  isCurrent: boolean;
  isIntersection: boolean;
  isLast: boolean;
}

const LinkedListNode: React.FC<LinkedListNodeProps> = ({
  node,
  isCurrent,
  isIntersection,
  isLast
}) => {
  const nodeClasses = [
    'node-value',
    isCurrent ? 'current' : '',
    isIntersection ? 'intersection' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className="node">
      <div className={nodeClasses}>{node.val}</div>
      {!isLast && <div className="arrow" />}
    </div>
  );
};

export default LinkedListNode; 