import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { Tool } from './types.js';
import { executePatch } from './utils.js';
import { InsertLinesContext } from './insertLinesTool.js';

interface InsertBeforeLinesArgs {
  pageTitle: string;
  targetLineText: string;
  text: string;
}

export const insertBeforeLinesTool: Tool<InsertLinesContext, InsertBeforeLinesArgs> = {
  name: 'insert_before_lines',
  description: 'Insert lines before the specified target line in a Cosense page.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      pageTitle: {
        type: 'string',
        description: 'Title of the page to modify',
      },
      targetLineText: {
        type: 'string',
        description: 'Text of the line before which to insert content',
      },
      text: {
        type: 'string',
        description: 'Text to insert. Use \\n for line breaks.',
      },
    },
    required: ['pageTitle', 'targetLineText', 'text'],
  },
  async execute(
    { pageTitle, targetLineText, text }: InsertBeforeLinesArgs,
    { projectName, cosenseOptions }: InsertLinesContext
  ): Promise<CallToolResult> {
    return executePatch(
      projectName,
      pageTitle,
      (lines) => {
        const index = lines.findIndex(line => line === targetLineText);
        const insertIndex = index < 0 ? lines.length : index;
        return [
          ...lines.slice(0, insertIndex),
          ...text.split('\n'),
          ...lines.slice(insertIndex),
        ];
      },
      cosenseOptions,
      'Successfully inserted lines before target.'
    );
  },
};
