import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { Tool } from './types.js';
import { executePatch } from './utils.js';
import { InsertLinesContext } from './insertLinesTool.js';

interface InsertIndentedLinesArgs {
  pageTitle: string;
  targetLineText: string;
  text: string;
}

export const insertIndentedLinesTool: Tool<InsertLinesContext, InsertIndentedLinesArgs> = {
  name: 'insert_indented_lines',
  description: 'Insert lines at the end of an indented block in a Cosense page.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      pageTitle: {
        type: 'string',
        description: 'Title of the page to modify',
      },
      targetLineText: {
        type: 'string',
        description: 'Text of the line after which to insert indented content',
      },
      text: {
        type: 'string',
        description: 'Text to insert. Use \\n for line breaks.',
      },
    },
    required: ['pageTitle', 'targetLineText', 'text'],
  },
  async execute(
    { pageTitle, targetLineText, text }: InsertIndentedLinesArgs,
    { projectName, cosenseOptions }: InsertLinesContext
  ): Promise<CallToolResult> {
    return executePatch(
      projectName,
      pageTitle,
      (lines) => {
        const index = lines.findIndex(line => line === targetLineText);
        if (index < 0) {
          return [
            ...lines,
            ...text.split('\n').map(line => '\t' + line),
          ];
        }

        // インデントされた子孫ブロックの末尾を探す
        let endIndex = index + 1;
        const baseIndent = lines[index].match(/^\t*/)[0].length;
        while (
          endIndex < lines.length &&
          lines[endIndex].match(/^\t*/)[0].length > baseIndent
        ) {
          endIndex++;
        }

        return [
          ...lines.slice(0, endIndex),
          ...text.split('\n').map(line => '\t'.repeat(baseIndent + 1) + line),
          ...lines.slice(endIndex),
        ];
      },
      cosenseOptions,
      'Successfully inserted indented lines.'
    );
  },
};
