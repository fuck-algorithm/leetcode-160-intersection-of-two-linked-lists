import React from 'react';

interface CreatorHeaderProps {
  onClose: () => void;
}

const CreatorHeader: React.FC<CreatorHeaderProps> = ({ onClose }) => {
  return (
    <div className="creator-header">
      <h3>创建链表示例</h3>
      <button className="creator-close-button" onClick={onClose}>×</button>
    </div>
  );
};

export default CreatorHeader; 