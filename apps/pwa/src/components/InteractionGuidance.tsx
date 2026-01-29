import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface InteractionGuidanceProps {
  /** Number of factors currently in the drill stack */
  drillFactorCount: number;
  /** Names of factors in the drill stack for display */
  drillFactors?: string[];
  /** Callback when user wants to navigate to Regression Panel */
  onNavigateToRegression?: () => void;
  /** Column aliases for display */
  columnAliases?: Record<string, string>;
}

/**
 * Interaction Guidance Prompt
 *
 * Shown in the VariationFunnel when 2+ factors are in the drill stack.
 * Educates users about interaction effects and guides them to the
 * Regression Panel for GLM analysis with interactions.
 *
 * Educational goal: Help users understand that sequential drill-down
 * (one-way ANOVA) captures main effects but can miss interactions
 * between factors.
 */
const InteractionGuidance: React.FC<InteractionGuidanceProps> = ({
  drillFactorCount,
  drillFactors = [],
  onNavigateToRegression,
  columnAliases = {},
}) => {
  // Only show when 2+ factors are selected
  if (drillFactorCount < 2) {
    return null;
  }

  // Get display names for factors
  const getDisplayName = (factor: string) => columnAliases[factor] || factor;

  // Build example text based on actual factors
  const exampleText =
    drillFactors.length >= 2
      ? `e.g., ${getDisplayName(drillFactors[0])} performance varies by ${getDisplayName(drillFactors[1])}`
      : 'e.g., Machine C is only problematic on Night shift';

  return (
    <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
      <div className="flex items-start gap-2">
        <Lightbulb size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-blue-300 mb-1">Analyzing multiple factors?</h4>
          <p className="text-xs text-content-secondary leading-relaxed mb-2">
            Your drill-down shows <span className="text-content">main effects</span>. To check if
            factors <span className="text-blue-300">interact</span> ({exampleText}), use the
            Regression Panel with &quot;Include interactions&quot;.
          </p>
          {onNavigateToRegression && (
            <button
              onClick={onNavigateToRegression}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors group"
            >
              Check Interactions
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractionGuidance;
