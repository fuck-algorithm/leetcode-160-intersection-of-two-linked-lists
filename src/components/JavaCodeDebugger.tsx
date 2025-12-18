import React from 'react';
import { ListNode, SolutionType } from '../types';

interface JavaCodeDebuggerProps {
  solutionType: SolutionType;
  currentNodeA: ListNode | null;
  currentNodeB: ListNode | null;
  step: number;
  completed: boolean;
  listAHead: ListNode | null;
  listBHead: ListNode | null;
}

// 代码 token 类型
type TokenType = 'keyword' | 'type' | 'function' | 'variable' | 'operator' | 'string' | 'number' | 'comment' | 'punctuation' | 'plain';

interface Token {
  type: TokenType;
  text: string;
}

// Java 关键字
const KEYWORDS = ['public', 'private', 'protected', 'class', 'if', 'else', 'while', 'for', 'return', 'null', 'new', 'void', 'static', 'final'];
const TYPES = ['ListNode', 'int', 'boolean', 'String', 'void'];

// 简单的 Java 词法分析器
const tokenizeLine = (line: string): Token[] => {
  const tokens: Token[] = [];
  
  // 处理注释
  if (line.trim().startsWith('//')) {
    tokens.push({ type: 'comment', text: line });
    return tokens;
  }
  
  // 简单的正则分词
  // eslint-disable-next-line no-useless-escape
  const regex = /(\s+)|([a-zA-Z_][a-zA-Z0-9_]*)|([0-9]+)|([{}();\[\],.])|([=!<>+\-*/?:]+)|(".*?")|(.)/g;
  let match;
  
  while ((match = regex.exec(line)) !== null) {
    const text = match[0];
    
    if (match[1]) {
      // 空白
      tokens.push({ type: 'plain', text });
    } else if (match[2]) {
      // 标识符
      if (KEYWORDS.includes(text)) {
        tokens.push({ type: 'keyword', text });
      } else if (TYPES.includes(text)) {
        tokens.push({ type: 'type', text });
      } else if (text === 'headA' || text === 'headB' || text === 'ptrA' || text === 'ptrB' || text === 'next') {
        tokens.push({ type: 'variable', text });
      } else if (text === 'getIntersectionNode') {
        tokens.push({ type: 'function', text });
      } else {
        tokens.push({ type: 'plain', text });
      }
    } else if (match[3]) {
      // 数字
      tokens.push({ type: 'number', text });
    } else if (match[4]) {
      // 标点
      tokens.push({ type: 'punctuation', text });
    } else if (match[5]) {
      // 运算符
      tokens.push({ type: 'operator', text });
    } else if (match[6]) {
      // 字符串
      tokens.push({ type: 'string', text });
    } else {
      tokens.push({ type: 'plain', text });
    }
  }
  
  return tokens;
};

// Java 代码行定义
const JAVA_CODE_LINES = [
  '// 双指针解法',
  'public ListNode getIntersectionNode(ListNode headA, ListNode headB) {',
  '    if (headA == null || headB == null) return null;',
  '    ',
  '    ListNode ptrA = headA;',
  '    ListNode ptrB = headB;',
  '    ',
  '    while (ptrA != ptrB) {',
  '        ptrA = (ptrA != null) ? ptrA.next : headB;',
  '        ptrB = (ptrB != null) ? ptrB.next : headA;',
  '    }',
  '    ',
  '    return ptrA;  // 返回交点或null',
  '}',
];

// 行号到变量映射：哪些行显示哪些变量的内联值
const LINE_VARIABLE_MAP: Record<number, string[]> = {
  4: ['ptrA'],      // ListNode ptrA = headA;
  5: ['ptrB'],      // ListNode ptrB = headB;
  7: ['ptrA', 'ptrB'], // while (ptrA != ptrB)
  8: ['ptrA'],      // ptrA = ...
  9: ['ptrB'],      // ptrB = ...
  12: ['ptrA'],     // return ptrA
};

// 根据算法步骤计算当前高亮行
const getHighlightedLine = (step: number, completed: boolean): number => {
  if (step === 0) return 1; // 函数入口
  if (completed) return 12; // return 语句
  if (step === 1) return 4; // ptrA = headA
  
  // 之后的步骤在 while 循环中交替
  const cycleStep = (step - 2) % 3;
  if (cycleStep === 0) return 7; // while 条件
  if (cycleStep === 1) return 8; // ptrA 移动
  return 9; // ptrB 移动
};

const JavaCodeDebugger: React.FC<JavaCodeDebuggerProps> = ({
  solutionType,
  currentNodeA,
  currentNodeB,
  step,
  completed,
  listAHead,
  listBHead,
}) => {
  const highlightedLine = getHighlightedLine(step, completed);

  // 格式化节点值显示（简短版本用于内联）
  const formatNodeValueShort = (node: ListNode | null): string => {
    if (node === null) return 'null';
    return `{val: ${node.val}}`;
  };

  // 格式化节点值显示（完整版本用于变量面板）
  const formatNodeValue = (node: ListNode | null): string => {
    if (node === null) return 'null';
    return `ListNode(val=${node.val})`;
  };

  // 获取变量当前值
  const getVariableValue = (varName: string): string => {
    switch (varName) {
      case 'ptrA': return formatNodeValueShort(currentNodeA);
      case 'ptrB': return formatNodeValueShort(currentNodeB);
      case 'headA': return formatNodeValueShort(listAHead);
      case 'headB': return formatNodeValueShort(listBHead);
      default: return '';
    }
  };

  // 获取行内变量显示
  const getInlineVariables = (lineIndex: number): { name: string; value: string; color: string }[] => {
    if (step < 1 && !completed) return [];
    
    const vars = LINE_VARIABLE_MAP[lineIndex];
    if (!vars) return [];
    
    return vars.map(name => ({
      name,
      value: getVariableValue(name),
      color: name === 'ptrA' ? '#4fc3f7' : name === 'ptrB' ? '#ce93d8' : '#81c784'
    }));
  };

  // 获取变量状态
  const getVariables = () => {
    const vars: { name: string; value: string; color: string }[] = [];
    
    if (step >= 1 || completed) {
      vars.push({
        name: 'ptrA',
        value: formatNodeValue(currentNodeA),
        color: '#4fc3f7',
      });
      vars.push({
        name: 'ptrB', 
        value: formatNodeValue(currentNodeB),
        color: '#ce93d8',
      });
    }
    
    if (listAHead) {
      vars.push({
        name: 'headA',
        value: formatNodeValue(listAHead),
        color: '#81c784',
      });
    }
    
    if (listBHead) {
      vars.push({
        name: 'headB',
        value: formatNodeValue(listBHead),
        color: '#ffb74d',
      });
    }

    return vars;
  };

  const variables = getVariables();

  // 渲染带语法高亮的代码行
  const renderHighlightedCode = (line: string) => {
    const tokens = tokenizeLine(line);
    return tokens.map((token, i) => (
      <span key={i} className={`token-${token.type}`}>{token.text}</span>
    ));
  };

  return (
    <div className="java-code-debugger">
      <div className="debugger-header">
        <span className="debugger-title">🔍 算法代码 - {solutionType}</span>
        <span className="step-indicator">Step: {step}</span>
      </div>
      
      <div className="code-and-vars">
        <div className="code-section">
          <pre className="java-code">
            {JAVA_CODE_LINES.map((line, index) => {
              const isHighlighted = highlightedLine === index;
              const inlineVars = isHighlighted ? getInlineVariables(index) : [];
              
              return (
                <div
                  key={index}
                  className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
                >
                  <span className="line-number">{index + 1}</span>
                  <span className="line-content">
                    {renderHighlightedCode(line)}
                  </span>
                  {inlineVars.length > 0 && (
                    <span className="inline-vars">
                      {inlineVars.map((v, i) => (
                        <span key={i} className="inline-var" style={{ color: v.color }}>
                          {v.name}={v.value}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              );
            })}
          </pre>
        </div>
        
        <div className="variables-section">
          <div className="variables-header">变量状态</div>
          <div className="variables-list">
            {variables.length === 0 ? (
              <div className="no-vars">点击"创建示例"开始</div>
            ) : (
              variables.map((v, i) => (
                <div key={i} className="variable-item">
                  <span className="var-name" style={{ color: v.color }}>{v.name}</span>
                  <span className="var-equals">=</span>
                  <span className="var-value">{v.value}</span>
                </div>
              ))
            )}
          </div>
          
          {completed && (
            <div className="result-section">
              <div className="result-label">返回值:</div>
              <div className="result-value">
                {currentNodeA ? `ListNode(val=${currentNodeA.val})` : 'null (无交点)'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JavaCodeDebugger;
