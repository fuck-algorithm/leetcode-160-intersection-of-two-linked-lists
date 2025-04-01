import React, { useRef, useEffect } from 'react';
import { LinkedListData, ListNode } from '../types';
import { renderLinkedList } from './visualizer/renderLinkedList';

interface D3LinkedListVisualizerProps {
  linkedList: LinkedListData;
  currentNode: ListNode | null;
  intersectionNode: ListNode | null;
  label: string;
  id: string;
  otherList?: LinkedListData; // 添加另一个链表的引用，用于绘制相交路径
}

const D3LinkedListVisualizer: React.FC<D3LinkedListVisualizerProps> = ({
  linkedList,
  currentNode,
  intersectionNode,
  label,
  id,
  otherList
}) => {
  const d3Container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    renderLinkedList({
      container: d3Container.current,
      linkedList,
      currentNode,
      intersectionNode,
      id,
      otherList
    });
  }, [linkedList, currentNode, intersectionNode, id, otherList]);

  return (
    <div className="linked-list-section">
      <h3>{label}</h3>
      <div className="d3-container" ref={d3Container} id={id}></div>
    </div>
  );
};

export default D3LinkedListVisualizer; 