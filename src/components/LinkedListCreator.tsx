import React, { useState, useEffect } from 'react';

interface LinkedListCreatorProps {
  onCreateCustom: (listAValues: number[], listBValues: number[], intersectionValues: number[]) => void;
  onCreateRandom: () => void;
  onClose: () => void;
}

const LinkedListCreator: React.FC<LinkedListCreatorProps> = ({ 
  onCreateCustom, 
  onCreateRandom,
  onClose 
}) => {
  const [listAInput, setListAInput] = useState<string>('');
  const [listBInput, setListBInput] = useState<string>('');
  const [intersectionInput, setIntersectionInput] = useState<string>('');

  // 生成随机数组
  const generateRandomArray = (length: number): string => {
    return Array.from({ length }, () => Math.floor(Math.random() * 20) + 1).join(',');
  };

  // 处理生成随机数据
  const handleGenerateRandom = () => {
    // 生成随机长度 (2-20个节点)
    const listALength = Math.floor(Math.random() * 19) + 2; // 2-20个节点
    const listBLength = Math.floor(Math.random() * 19) + 2; // 2-20个节点
    
    // 随机决定是否生成相交部分（60%的概率有相交部分）
    const hasIntersection = Math.random() < 0.6;
    
    // 生成随机值
    const randomListA = generateRandomArray(listALength);
    const randomListB = generateRandomArray(listBLength);
    
    // 如果有相交部分，生成随机节点的相交部分，否则为空
    // 相交部分的长度不应该超过A和B链表长度的一半，使得更像是真实场景
    const maxIntersectionLength = Math.min(
      Math.floor(Math.min(listALength, listBLength) / 2),
      10 // 最多10个节点相交，保证视觉清晰
    );
    
    const intersectionLength = hasIntersection 
      ? Math.floor(Math.random() * maxIntersectionLength) + 1 // 至少1个节点
      : 0;
    
    const randomIntersection = intersectionLength > 0 
      ? generateRandomArray(intersectionLength) 
      : '';
    
    // 更新输入字段
    setListAInput(randomListA);
    setListBInput(randomListB);
    setIntersectionInput(randomIntersection);
  };

  // 组件首次渲染时自动生成随机数据
  useEffect(() => {
    handleGenerateRandom();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const listAValues = listAInput.split(',').map(val => parseInt(val.trim())).filter(val => !isNaN(val));
    const listBValues = listBInput.split(',').map(val => parseInt(val.trim())).filter(val => !isNaN(val));
    const intersectionValues = intersectionInput.split(',').map(val => parseInt(val.trim())).filter(val => !isNaN(val));
    
    onCreateCustom(listAValues, listBValues, intersectionValues);
  };

  return (
    <div className="linked-list-creator-overlay">
      <div className="linked-list-creator">
        <div className="creator-header">
          <h3>创建链表示例</h3>
          <button className="creator-close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="creator-content">
          <button 
            className="random-button" 
            onClick={handleGenerateRandom}
          >
            生成随机数据
          </button>
          
          <div className="divider">或者</div>
          
          <form onSubmit={handleSubmit}>
            <div className="creator-field">
              <label>链表 A (相交前):<span className="required">*</span></label>
              <input
                type="text"
                value={listAInput}
                onChange={(e) => setListAInput(e.target.value)}
                placeholder="输入值，以逗号分隔，例如: 4,1"
                required
              />
            </div>
            
            <div className="creator-field">
              <label>链表 B (相交前):<span className="required">*</span></label>
              <input
                type="text"
                value={listBInput}
                onChange={(e) => setListBInput(e.target.value)}
                placeholder="输入值，以逗号分隔，例如: 5,6,1"
                required
              />
            </div>
            
            <div className="creator-field">
              <label>相交部分: <span className="optional">(可选)</span></label>
              <input
                type="text"
                value={intersectionInput}
                onChange={(e) => setIntersectionInput(e.target.value)}
                placeholder="输入值，以逗号分隔，例如: 8,4,5，留空表示没有相交"
              />
            </div>
            
            <div className="creator-footer">
              <button type="submit" className="create-button">创建自定义示例</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LinkedListCreator; 