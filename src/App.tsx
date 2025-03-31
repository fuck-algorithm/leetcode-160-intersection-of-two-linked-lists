import React, { useEffect } from 'react';
import SolutionCode from './components/SolutionCode';
import D3TwoPointerVisualizer from './components/D3TwoPointerVisualizer';
import LinkedListCreator from './components/LinkedListCreator';
import ProblemDescription from './components/ProblemDescription';
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

  // 添加键盘事件监听器
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 确保未在可编辑元素内（如输入框、文本区域等）
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA' ||
        showCreator // 如果创建器对话框打开，不响应键盘
      ) {
        return;
      }

      // 左箭头 - 上一步
      if (event.key === 'ArrowLeft' && !(state.step === 0 || state.listA.nodes.length === 0)) {
        handleStepBackward();
      }
      // 右箭头 - 下一步
      else if (event.key === 'ArrowRight' && !(state.completed || state.listA.nodes.length === 0)) {
        handleStepForward();
      }
      // 空格键 - 暂停/运行
      else if (event.key === ' ' && state.listA.nodes.length > 0) {
        event.preventDefault(); // 防止页面滚动
        toggleAutoExecution();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // 清理函数
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.step, state.completed, state.listA.nodes.length, handleStepBackward, handleStepForward, toggleAutoExecution, showCreator, state.isRunning]);

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
        <a 
          href="https://github.com/fuck-algorithm/leetcode-160-intersection-of-two-linked-lists" 
          target="_blank" 
          rel="noopener noreferrer"
          className="github-link"
          title="View on GitHub"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
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
                      title="使用键盘左箭头键(←)也可以执行此操作"
                    >
                      <span className="button-text">← 上一步</span>
                      <span className="keyboard-hint">←</span>
                    </button>
                    <button 
                      className="control-button step" 
                      onClick={handleStepForward} 
                      disabled={state.completed || state.listA.nodes.length === 0}
                      title="使用键盘右箭头键(→)也可以执行此操作"
                    >
                      <span className="button-text">下一步 →</span>
                      <span className="keyboard-hint">→</span>
                    </button>
                  </div>
                  <button 
                    className="control-button play" 
                    onClick={toggleAutoExecution} 
                    disabled={state.completed || state.listA.nodes.length === 0}
                    title="使用空格键可以暂停/继续执行"
                  >
                    <span className="button-text">{state.isRunning ? '暂停' : '连续执行'}</span>
                    <span className="keyboard-hint">Space</span>
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
                  <label htmlFor="speed-control">执行延迟：</label>
                  <input 
                    id="speed-control" 
                    type="range" 
                    min="100" 
                    max="2000" 
                    step="100" 
                    value={state.speed} 
                    onChange={handleSpeedChange}
                    disabled={state.isRunning}
                    className="speed-slider"
                    title="数值越小执行越快，数值越大执行越慢"
                  />
                  <span className="delay-value">{state.speed}ms</span>
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
                    // 不需要在这里调用toggleAutoExecution，
                    // 自动执行逻辑已在useAlgorithmSteps hook的useEffect中处理
                    // 调用它会导致自动执行在一步后停止
                  }}
                />
              </div>
            </div>
          </Tab>
          <Tab id="problem" label="题目描述">
            <ProblemDescription />
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