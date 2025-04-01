import React, { useState, useEffect } from 'react';
import LinkedListForm from './linkedListCreator/LinkedListForm';
import CreatorHeader from './linkedListCreator/CreatorHeader';
import { generateRandomLinkedListData } from './linkedListCreator/randomGenerator';

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

  const handleGenerateRandom = () => {
    const { listA, listB, intersection } = generateRandomLinkedListData();
    setListAInput(listA);
    setListBInput(listB);
    setIntersectionInput(intersection);
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
        <CreatorHeader onClose={onClose} />
        
        <div className="creator-content">
          <button 
            className="random-button" 
            onClick={handleGenerateRandom}
          >
            生成随机数据
          </button>
          
          <div className="divider">或者</div>
          
          <LinkedListForm
            listAInput={listAInput}
            listBInput={listBInput}
            intersectionInput={intersectionInput}
            setListAInput={setListAInput}
            setListBInput={setListBInput}
            setIntersectionInput={setIntersectionInput}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default LinkedListCreator; 