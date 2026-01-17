/**
 * Centralized interaction styles for chart components
 *
 * Provides consistent cursor and hover styles across all interactive chart elements.
 * These CSS class strings can be applied to SVG elements via className.
 */

/**
 * CSS class strings for interactive chart elements
 * Apply these using the className prop on SVG elements
 */
export const interactionStyles = {
  /**
   * Standard clickable element - cursor pointer with opacity feedback
   * Use for bars, boxes, points that can be clicked
   */
  clickable: 'cursor-pointer hover:opacity-80 transition-opacity duration-150',

  /**
   * Subtle clickable element - less opacity change on hover
   * Use for secondary interactive elements or text labels
   */
  clickableSubtle: 'cursor-pointer hover:opacity-90 transition-opacity duration-150',

  /**
   * Non-interactive element - default cursor
   * Explicitly marks an element as not interactive
   */
  static: 'cursor-default',
} as const;

/**
 * Get interaction class based on whether a click handler exists
 * @param hasClickHandler - Whether the element has an onClick handler
 * @param variant - Style variant to use
 * @returns CSS class string or empty string
 */
export function getInteractionClass(
  hasClickHandler: boolean,
  variant: 'clickable' | 'clickableSubtle' = 'clickable'
): string {
  return hasClickHandler ? interactionStyles[variant] : '';
}

/**
 * Inline style object for hover states (for SVG elements that don't support className well)
 * Use when className-based hover doesn't work (e.g., some visx components)
 */
export const interactionInlineStyles = {
  clickable: {
    cursor: 'pointer',
  },
  static: {
    cursor: 'default',
  },
} as const;

/**
 * Opacity values for interactive states
 */
export const hoverOpacity = {
  /** Default hover opacity for clickable elements */
  default: 0.8,
  /** Subtle hover opacity for secondary elements */
  subtle: 0.9,
  /** Opacity for dimmed/unselected items */
  dimmed: 0.3,
} as const;
