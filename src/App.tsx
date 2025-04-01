import React, { useEffect } from 'react';
import { TabView, Tab } from './components/TabView';
import Header from './components/layout/Header';
import VisualizationTab from './components/layout/VisualizationTab';
import CodeTab from './components/layout/CodeTab';
import ProblemDescription from './components/ProblemDescription';
import LinkedListCreator from './components/LinkedListCreator';
import { useStateManagement } from './hooks/algorithmSteps';
import { useAlgorithmSteps } from './hooks/useAlgorithmSteps';

const App: React.FC = () => {
  const {
    showCreator, 
    setShowCreator
  } = useStateManagement();
  
  const {
    state,
    createRandomExample,
    createCustomExample,
    handleStepForward,
    handleStepBackward,
    handleSpeedChange,
    toggleAutoExecution,
    resetExecution,
    handleChangeSolution
  } = useAlgorithmSteps();

  useEffect(() => {
    console.log('App组件 - showCreator状态变化:', showCreator);
  }, [showCreator]);

  console.log('App组件渲染 - showCreator状态值:', showCreator);

  return (
    <div className="app-container">
      <Header />
      
      <main className="app-content" style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <TabView defaultTab="visualization">
          <Tab id="visualization" label="可视化">
            <VisualizationTab 
              state={state} 
              onOpenCreator={() => {
                console.log('App直接设置showCreator为true');
                setShowCreator(true);
              }}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onSpeedChange={handleSpeedChange}
              onToggleExecution={toggleAutoExecution}
              onReset={resetExecution}
            />
          </Tab>
          <Tab id="problem" label="题目描述">
            <ProblemDescription />
          </Tab>
          <Tab id="code" label="算法代码">
            <CodeTab solutionType={state.solutionType} />
          </Tab>
        </TabView>
      </main>
      
      {showCreator && (
        <LinkedListCreator
          onCreateCustom={(valuesA, valuesB, intersectionValues) => {
            console.log('App调用createCustomExample');
            createCustomExample(valuesA, valuesB, intersectionValues);
            console.log('App额外调用setShowCreator(false)');
            setShowCreator(false);
          }}
          onCreateRandom={() => {
            console.log('App调用createRandomExample');
            createRandomExample();
            console.log('App额外调用setShowCreator(false)');
            setShowCreator(false);
          }}
          onClose={() => {
            console.log('App直接设置showCreator为false');
            setShowCreator(false);
          }}
        />
      )}
    </div>
  );
};

export default App; 