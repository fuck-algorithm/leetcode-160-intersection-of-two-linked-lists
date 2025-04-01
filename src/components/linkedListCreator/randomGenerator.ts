// 生成指定长度的随机数组字符串
export const generateRandomArray = (length: number): string => {
  return Array.from({ length }, () => Math.floor(Math.random() * 20) + 1).join(',');
};

// 生成随机链表数据
export const generateRandomLinkedListData = (): {
  listA: string;
  listB: string;
  intersection: string;
} => {
  // 生成随机长度 (2-20个节点)
  const listALength = Math.floor(Math.random() * 19) + 2; // 2-20个节点
  const listBLength = Math.floor(Math.random() * 19) + 2; // 2-20个节点
  
  // 随机决定是否生成相交部分（60%的概率有相交部分）
  const hasIntersection = Math.random() < 0.6;
  
  // 生成随机值
  const listA = generateRandomArray(listALength);
  const listB = generateRandomArray(listBLength);
  
  // 如果有相交部分，生成随机节点的相交部分，否则为空
  // 相交部分的长度不应该超过A和B链表长度的一半，使得更像是真实场景
  const maxIntersectionLength = Math.min(
    Math.floor(Math.min(listALength, listBLength) / 2),
    10 // 最多10个节点相交，保证视觉清晰
  );
  
  const intersectionLength = hasIntersection 
    ? Math.floor(Math.random() * maxIntersectionLength) + 1 // 至少1个节点
    : 0;
  
  const intersection = intersectionLength > 0 
    ? generateRandomArray(intersectionLength) 
    : '';
  
  return { listA, listB, intersection };
}; 