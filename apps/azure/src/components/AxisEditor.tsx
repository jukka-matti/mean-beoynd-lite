/**
 * AxisEditor wrapper for Azure app
 *
 * Applies Azure Slate color scheme to the shared AxisEditor from @variscout/ui.
 * For new code, import directly from '@variscout/ui' and use axisEditorAzureColorScheme.
 */
import React from 'react';
import {
  AxisEditor as SharedAxisEditor,
  axisEditorAzureColorScheme,
  type AxisEditorProps,
} from '@variscout/ui';

const AxisEditor = (props: Omit<AxisEditorProps, 'colorScheme'>) => (
  <SharedAxisEditor {...props} colorScheme={axisEditorAzureColorScheme} />
);

export default AxisEditor;
