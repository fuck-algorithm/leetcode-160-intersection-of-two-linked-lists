// 生成随机数字数组
export const generateRandomArray = (length: number): number[] => {
  // 使用固定的随机数池，这样每次生成的序列都是确定的
  const randomPool = [5, 9, 12, 7, 3, 15, 11, 19, 8, 1, 14, 6, 10, 17, 4, 2, 13, 18, 16, 20];
  
  // 从固定池中选择数字，如果长度超过池大小则循环使用
  return Array.from({ length }, (_, i) => randomPool[i % randomPool.length]);
}; 