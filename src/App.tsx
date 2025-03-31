import React from 'react';
import SolutionCode from './components/SolutionCode';
import D3TwoPointerVisualizer from './components/D3TwoPointerVisualizer';
import LinkedListCreator from './components/LinkedListCreator';
import { useAlgorithmSteps } from './hooks/useAlgorithmSteps';
import { TabView, Tab } from './components/TabView';

const App: React.FC = () => {
  const {
    state,
    showCreator,
    openCreator,
    closeCreator,
    createRandomExample,
    createCustomExample,
    handleStepForward,
    handleStepBackward,
    handleSpeedChange,
    toggleAutoExecution,
    resetExecution
  } = useAlgorithmSteps();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>
          <a href="https://leetcode.cn/problems/intersection-of-two-linked-lists/description/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="title-link">
            LeetCode 160: 相交链表
          </a>
        </h1>
      </header>
      
      <main className="app-content">
        <TabView defaultTab="visualization">
          <Tab id="visualization" label="可视化">
            <div className="visualization-tab">
              <div className="control-panel">
                <div className="button-group">
                  <button className="control-button create" onClick={openCreator}>创建示例</button>
                  <div className="step-controls">
                    <button 
                      className="control-button prev" 
                      onClick={handleStepBackward} 
                      disabled={state.step === 0 || state.listA.nodes.length === 0}
                    >
                      ← 上一步
                    </button>
                    <button 
                      className="control-button step" 
                      onClick={handleStepForward} 
                      disabled={state.completed || state.listA.nodes.length === 0}
                    >
                      下一步 →
                    </button>
                  </div>
                  <button 
                    className="control-button play" 
                    onClick={toggleAutoExecution} 
                    disabled={state.completed || state.listA.nodes.length === 0}
                  >
                    {state.isRunning ? '暂停' : '连续执行'}
                  </button>
                  <button 
                    className="control-button reset" 
                    onClick={resetExecution} 
                    disabled={state.step === 0 || state.listA.nodes.length === 0}
                  >
                    重置
                  </button>
                </div>
                
                <div className="selection-group">  
                  <label htmlFor="speed-control">速度：</label>
                  <input 
                    id="speed-control" 
                    type="range" 
                    min="100" 
                    max="2000" 
                    step="100" 
                    value={state.speed} 
                    onChange={handleSpeedChange}
                    disabled={state.isRunning}
                  />
                </div>
              </div>
              <div className="visualization-container">
                <D3TwoPointerVisualizer
                  listA={state.listA}
                  listB={state.listB}
                  currentNodeA={state.currentNodeA}
                  currentNodeB={state.currentNodeB}
                  intersectionNode={state.intersection}
                  speed={state.speed}
                  isRunning={state.isRunning}
                  message={state.message}
                  step={state.step}
                  onAnimationComplete={() => {
                    if (state.isRunning) {
                      toggleAutoExecution();
                    }
                  }}
                />
              </div>
            </div>
          </Tab>
          <Tab id="code" label="算法代码">
            <div className="solution-panel full-height">
              <h3>双指针解法代码</h3>
              <SolutionCode solutionType={state.solutionType} />
            </div>
          </Tab>
        </TabView>
      </main>
      
      {showCreator && (
        <LinkedListCreator
          onCreateCustom={createCustomExample}
          onCreateRandom={createRandomExample}
          onClose={closeCreator}
        />
      )}
    </div>
  );
};

export default App; 