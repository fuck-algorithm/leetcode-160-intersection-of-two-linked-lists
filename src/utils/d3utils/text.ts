import * as d3 from 'd3';

/**
 * 文本自动换行函数
 */
export const wrapText = (
  text: d3.Selection<SVGTextElement, unknown, null, undefined>, 
  width: number,
  lineHeight: number
) => {
  const words = text.text().split(/\s+/).reverse();
  const x = text.attr('x');
  const y = text.attr('y');
  
  text.text(null);
  
  let line: string[] = [];
  let lineNumber = 0;
  let tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', 0);
  
  let word: string | undefined;
  while (word = words.pop()) {
    line.push(word);
    tspan.text(line.join(' '));
    
    if (tspan.node()?.getComputedTextLength() as number > width) {
      line.pop();
      tspan.text(line.join(' '));
      line = [word];
      tspan = text.append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', ++lineNumber * lineHeight + 'px')
        .text(word);
    }
  }
}; 