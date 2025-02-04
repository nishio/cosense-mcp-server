import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { Tool } from './types.js';
import { executePatch } from './utils.js';
import { InsertLinesContext } from './insertLinesTool.js';

interface AppendLinesArgs {
  pageTitle: string;
  text: string;
}

export const appendLinesTool: Tool<AppendLinesContext, AppendLinesArgs> = {
  name: 'append_lines',
  description: 'Append lines to the end of a Cosense page.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      pageTitle: {
        type: 'string',
        description: 'Title of the page to modify',
      },
      text: {
        type: 'string',
        description: 'Text to append. Use \\n for line breaks.',
      },
    },
    required: ['pageTitle', 'text'],
  },
  async execute(
    { pageTitle, text }: AppendLinesArgs,
    { projectName, cosenseOptions }: AppendLinesContext
  ): Promise<CallToolResult> {
    return executePatch(
      projectName,
      pageTitle,
      (lines) => [...lines, ...text.split('\n')],
      cosenseOptions,
      'Successfully appended lines.'
    );
  },
};
