/**
 * 渲染管理器入口
 * 重新导出所有渲染相关功能
 * @deprecated 请直接从'/renderManager'目录导入具体组件
 */

import { renderVisualizer } from './renderManager/renderVisualizer';
import { renderEmptyState } from './renderManager/renderEmptyState';
import { renderLinkedLists } from './renderManager/renderLinkedLists';
import { renderIntersection } from './renderManager/renderIntersection';
import { setupSVG } from './renderManager/setupSVG';
import { logPointerPositions } from './renderManager/logPointerPositions';

export {
  renderVisualizer,
  renderEmptyState,
  renderLinkedLists,
  renderIntersection,
  setupSVG,
  logPointerPositions
}; 