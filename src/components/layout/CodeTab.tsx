import React from 'react';
import SolutionCode from '../SolutionCode';
import { SolutionType } from '../../types';

interface CodeTabProps {
  solutionType: SolutionType;
}

const CodeTab: React.FC<CodeTabProps> = ({ solutionType }) => {
  return (
    <div className="solution-panel full-height">
      <h3>算法代码</h3>
      <SolutionCode solutionType={solutionType} />
    </div>
  );
};

export default CodeTab; 