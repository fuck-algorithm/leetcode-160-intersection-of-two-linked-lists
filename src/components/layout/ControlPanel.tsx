import React from 'react';
import { VisualizationState } from '../../types';

interface ControlPanelProps {
  state: VisualizationState;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleExecution: () => void;
  onReset: () => void;
  onOpenCreator: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  onToggleExecution,
  onReset,
  onOpenCreator
}) => {
  // 添加一个带有调试日志的处理函数
  const handleOpenCreator = () => {
    console.log('创建示例按钮被点击');
    onOpenCreator();
  };

  return (
    <div className="control-panel">
      <div className="button-group">
        <button 
          className="control-button create" 
          onClick={handleOpenCreator}
        >
          创建示例
        </button>
        <div className="step-controls">
          <button 
            className="control-button prev" 
            onClick={onStepBackward} 
            disabled={state.step === 0 || state.listA.nodes.length === 0}
            title="使用键盘左箭头键(←)也可以执行此操作"
          >
            <span className="button-text">← 上一步</span>
            <span className="keyboard-hint">←</span>
          </button>
          <button 
            className="control-button step" 
            onClick={onStepForward} 
            disabled={state.completed || state.listA.nodes.length === 0}
            title="使用键盘右箭头键(→)也可以执行此操作"
          >
            <span className="button-text">下一步 →</span>
            <span className="keyboard-hint">→</span>
          </button>
        </div>
        <button 
          className="control-button play" 
          onClick={onToggleExecution} 
          disabled={state.completed || state.listA.nodes.length === 0}
          title="使用空格键可以暂停/继续执行"
        >
          <span className="button-text">{state.isRunning ? '暂停' : '连续执行'}</span>
          <span className="keyboard-hint">Space</span>
        </button>
        <button 
          className="control-button reset" 
          onClick={onReset} 
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
          onChange={onSpeedChange}
          disabled={state.isRunning}
          className="speed-slider"
          title="数值越小执行越快，数值越大执行越慢"
        />
        <span className="delay-value">{state.speed}ms</span>
      </div>
    </div>
  );
};

export default ControlPanel; 