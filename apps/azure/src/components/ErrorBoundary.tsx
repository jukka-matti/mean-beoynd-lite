/**
 * ErrorBoundary wrapper for Azure app
 *
 * Applies Azure Slate color scheme to the shared ErrorBoundary from @variscout/ui.
 * For new code, import directly from '@variscout/ui' and use errorBoundaryAzureColorScheme.
 */
import React from 'react';
import {
  ErrorBoundary as SharedErrorBoundary,
  errorBoundaryAzureColorScheme,
  type ErrorBoundaryProps,
} from '@variscout/ui';

const ErrorBoundary = (props: Omit<ErrorBoundaryProps, 'colorScheme'>) => (
  <SharedErrorBoundary {...props} colorScheme={errorBoundaryAzureColorScheme} />
);

export default ErrorBoundary;
