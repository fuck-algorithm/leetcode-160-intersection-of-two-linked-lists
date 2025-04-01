import { useState, useEffect, RefObject } from 'react';

// 自定义Hook来监听和更新容器尺寸
export const useContainerSize = (containerRef: RefObject<HTMLDivElement>) => {
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 800 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    // 初始设置尺寸
    updateSize();

    // 使用ResizeObserver监听容器大小变化
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);

    // 清理函数
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return containerSize;
}; 