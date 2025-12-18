import React, { useEffect } from 'react';
import D3TwoPointerVisualizer from '../D3TwoPointerVisualizer';
import ControlPanel from './ControlPanel';
import JavaCodeDebugger from '../JavaCodeDebugger';
import { VisualizationState } from '../../types';

interface VisualizationTabProps {
  state: VisualizationState;
  onOpenCreator?: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleExecution: () => void;
  onReset: () => void;
  onSeekToStep?: (step: number) => void;
}

const VisualizationTab: React.FC<VisualizationTabProps> = ({ 
  state, 
  onOpenCreator,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  onToggleExecution,
  onReset,
  onSeekToStep
}) => {
  // 添加键盘事件监听器
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 确保未在可编辑元素内（如输入框、文本区域等）
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // 左箭头 - 上一步
      if (event.key === 'ArrowLeft' && !(state.step === 0 || state.listA.nodes.length === 0)) {
        onStepBackward();
      }
      // 右箭头 - 下一步
      else if (event.key === 'ArrowRight' && !(state.completed || state.listA.nodes.length === 0)) {
        onStepForward();
      }
      // 空格键 - 暂停/运行
      else if (event.key === ' ' && state.listA.nodes.length > 0) {
        event.preventDefault(); // 防止页面滚动
        onToggleExecution();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // 清理函数
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    state.step, 
    state.completed, 
    state.listA.nodes.length, 
    onStepBackward, 
    onStepForward, 
    onToggleExecution
  ]);

  // 处理打开创建器的回调函数
  const handleOpenCreator = () => {
    console.log('VisualizationTab - handleOpenCreator调用');
    if (onOpenCreator) {
      onOpenCreator();
    } else {
      console.warn('缺少onOpenCreator回调');
    }
  };

  return (
    <div className="visualization-tab">
      <ControlPanel 
        state={state}
        onStepForward={onStepForward}
        onStepBackward={onStepBackward}
        onSpeedChange={onSpeedChange}
        onToggleExecution={onToggleExecution}
        onReset={onReset}
        onOpenCreator={handleOpenCreator}
        onSeekToStep={onSeekToStep}
      />
      <div className="visualization-main-content">
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
            pointerAJumped={state.pointerAJumped}
            pointerBJumped={state.pointerBJumped}
            onAnimationComplete={() => {/* 不需要额外操作 */}}
          />
        </div>
        <JavaCodeDebugger
          solutionType={state.solutionType}
          currentNodeA={state.currentNodeA}
          currentNodeB={state.currentNodeB}
          step={state.step}
          completed={state.completed}
          listAHead={state.listA.head}
          listBHead={state.listB.head}
        />
      </div>
    </div>
  );
};

export default VisualizationTab;
