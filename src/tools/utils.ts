import { patch, type PatchOptions } from '@cosense/std/websocket';
import { unwrapErr } from 'option-t/plain_result';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export type PatchFunction = (lines: string[]) => string[];

export async function executePatch(
  projectName: string,
  pageTitle: string,
  patchFn: PatchFunction,
  cosenseOptions?: PatchOptions,
  successMessage: string = 'Successfully modified the page.'
): Promise<CallToolResult> {
  const result = await patch(
    projectName,
    pageTitle,
    (lines) => patchFn(lines.map(line => line.text)),
    cosenseOptions
  );

  if (result.ok) {
    return {
      content: [{ type: 'text', text: successMessage }],
    };
  } else {
    throw unwrapErr(result);
  }
}
