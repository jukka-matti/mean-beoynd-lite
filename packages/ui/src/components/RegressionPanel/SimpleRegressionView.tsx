import React from 'react';
import { ScatterPlot } from '@variscout/charts';
import { getStars } from '@variscout/core';
import { HelpTooltip } from '../HelpTooltip';
import { useGlossary } from '../../hooks';
import { ChevronDown, X } from 'lucide-react';
import {
  regressionViewDefaultColorScheme,
  type SimpleRegressionViewComponentProps,
} from './regressionViewColors';

/**
 * Simple regression mode: 2x2 grid of scatter plots with column selector
 */
export const SimpleRegressionView: React.FC<SimpleRegressionViewComponentProps> = ({
  outcome,
  numericColumns,
  selectedXColumns,
  toggleXColumn,
  regressionResults,
  sortedByStrength,
  specs,
  onExpandChart,
  colorScheme = regressionViewDefaultColorScheme,
}) => {
  const { getTerm } = useGlossary();
  const c = colorScheme;

  return (
    <>
      {/* Column selector */}
      <div className={`flex-none px-4 py-3 border-b ${c.border} ${c.sectionBg}`}>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-xs ${c.secondaryText} uppercase tracking-wider`}>
            X Variables:
          </span>
          <div className="relative">
            <select
              onChange={e => {
                const col = e.target.value;
                if (col && !selectedXColumns.includes(col)) {
                  toggleXColumn(col);
                }
                e.target.value = '';
              }}
              className={`${c.inputBg} border ${c.inputBorder} text-xs text-white rounded px-2 py-1.5 pr-6 outline-none focus:border-blue-500`}
            >
              <option value="">+ Add column</option>
              {numericColumns
                .filter(nc => !selectedXColumns.includes(nc))
                .map(col => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
            </select>
            <ChevronDown
              size={12}
              className={`absolute right-2 top-1/2 -translate-y-1/2 ${c.secondaryText} pointer-events-none`}
            />
          </div>
          {selectedXColumns.map(col => (
            <span
              key={col}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
            >
              {col}
              <button onClick={() => toggleXColumn(col)} className="hover:text-white">
                <X size={12} />
              </button>
            </span>
          ))}
          <span className={`text-xs ${c.mutedText}`}>&rarr; {outcome}</span>
        </div>
      </div>

      {/* 2x2 Grid of scatter plots */}
      <div className="flex-1 p-4 overflow-auto">
        {regressionResults.length === 0 ? (
          <div className={`flex items-center justify-center h-full ${c.mutedText}`}>
            Select X variables above to view regression analysis
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {regressionResults.map(result => {
              const rSquared =
                result.recommendedFit === 'quadratic' && result.quadratic
                  ? result.quadratic.rSquared
                  : result.linear.rSquared;

              return (
                <div
                  key={result.xColumn}
                  className={`${c.cardBg} rounded-xl border ${c.border} overflow-hidden flex flex-col min-h-[280px]`}
                >
                  <div
                    className={`flex items-center justify-between px-3 py-2 border-b ${c.borderSubtle}`}
                  >
                    <span className={`text-xs font-medium ${c.contentText} truncate`}>
                      {result.xColumn} vs {result.yColumn}
                    </span>
                    <span className={`text-xs ${c.secondaryText} flex items-center gap-1`}>
                      R²={rSquared.toFixed(2)}{' '}
                      <span className="text-yellow-400">{getStars(result.strengthRating)}</span>
                      <HelpTooltip term={getTerm('rSquared')} iconSize={10} />
                    </span>
                  </div>
                  <div
                    className="flex-1 min-h-0 cursor-pointer"
                    onClick={() => onExpandChart(result.xColumn)}
                  >
                    <ScatterPlot
                      regression={result}
                      specs={specs ?? undefined}
                      showBranding={false}
                      showStars={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary ranking bar */}
      {sortedByStrength.length > 1 && (
        <div className={`flex-none px-4 py-3 border-t ${c.border} ${c.sectionBg}`}>
          <div className="flex items-center gap-2 text-xs">
            <span className={c.secondaryText}>Ranking:</span>
            {sortedByStrength.map((r, i) => (
              <React.Fragment key={r.xColumn}>
                {i > 0 && <span className={c.rankingSeparator}>&rarr;</span>}
                <span
                  className={`px-2 py-0.5 rounded ${
                    i === 0 ? 'bg-green-500/20 text-green-400' : `${c.tertiaryBg} ${c.contentText}`
                  }`}
                >
                  {r.xColumn}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
