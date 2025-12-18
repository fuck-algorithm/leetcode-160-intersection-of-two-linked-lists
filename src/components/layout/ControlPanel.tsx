import React, { useMemo } from 'react';
import { VisualizationState } from '../../types';

interface ControlPanelProps {
  state: VisualizationState;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleExecution: () => void;
  onReset: () => void;
  onOpenCreator: () => void;
  onSeekToStep?: (step: number) => void;
  totalSteps?: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  onToggleExecution,
  onReset,
  onOpenCreator,
  onSeekToStep,
  totalSteps
}) => {
  // 添加一个带有调试日志的处理函数
  const handleOpenCreator = () => {
    console.log('创建示例按钮被点击');
    onOpenCreator();
  };

  // 计算预估的总步骤数
  const estimatedTotalSteps = useMemo(() => {
    if (totalSteps !== undefined) return totalSteps;
    // 基于链表长度估算总步骤数
    // 双指针算法大约需要 (lenA + lenB) 步
    const lenA = state.listA.nodes.length;
    const lenB = state.listB.nodes.length;
    if (lenA === 0 && lenB === 0) return 0;
    return Math.max(1, lenA + lenB + 2); // +2 for initialization and completion
  }, [state.listA.nodes.length, state.listB.nodes.length, totalSteps]);

  // 计算进度百分比
  const progressPercent = useMemo(() => {
    if (estimatedTotalSteps === 0) return 0;
    return Math.min(100, (state.step / estimatedTotalSteps) * 100);
  }, [state.step, estimatedTotalSteps]);

  // 处理进度条拖动
  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStep = parseInt(event.target.value, 10);
    if (onSeekToStep && newStep !== state.step) {
      onSeekToStep(newStep);
    }
  };

  const hasData = state.listA.nodes.length > 0;

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
      
      {/* 进度条 */}
      <div className="progress-group">
        <div className="progress-container">
          <div 
            className="progress-bar"
            style={{ 
              background: `linear-gradient(to right, #4CAF50 ${progressPercent}%, #e0e0e0 ${progressPercent}%)`
            }}
          >
            <input
              type="range"
              min="0"
              max={state.completed ? state.step : estimatedTotalSteps}
              value={state.step}
              onChange={handleProgressChange}
              disabled={!hasData || state.isRunning}
              className="progress-slider"
              title="拖动调整执行进度"
            />
          </div>
          <span className="progress-text">
            {hasData ? `${state.step} / ${state.completed ? state.step : '~' + estimatedTotalSteps}` : '0 / 0'}
          </span>
        </div>
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