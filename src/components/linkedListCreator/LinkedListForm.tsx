import React from 'react';

interface LinkedListFormProps {
  listAInput: string;
  listBInput: string;
  intersectionInput: string;
  setListAInput: (value: string) => void;
  setListBInput: (value: string) => void;
  setIntersectionInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const LinkedListForm: React.FC<LinkedListFormProps> = ({
  listAInput,
  listBInput,
  intersectionInput,
  setListAInput,
  setListBInput,
  setIntersectionInput,
  handleSubmit
}) => {
  return (
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
        <button type="submit" className="create-button">创建示例</button>
      </div>
    </form>
  );
};

export default LinkedListForm; 