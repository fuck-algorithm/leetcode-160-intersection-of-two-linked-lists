import React from 'react';
import { ProblemHeader } from './problem/ProblemHeader';
import { ProblemContent } from './problem/ProblemContent';
import { ProblemExamples } from './problem/ProblemExamples';
import { ProblemConstraints } from './problem/ProblemConstraints';
import { ProblemFooter } from './problem/ProblemFooter';

const ProblemDescription: React.FC = () => {
  return (
    <div className="problem-description">
      <div className="problem-section">
        <ProblemHeader />
        <ProblemContent />
        <ProblemExamples />
        <ProblemConstraints />
        <ProblemFooter />
      </div>
    </div>
  );
};

export default ProblemDescription; 