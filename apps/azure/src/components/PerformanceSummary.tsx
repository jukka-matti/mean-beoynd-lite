/**
 * PerformanceSummary - Health summary bar for performance mode
 *
 * Shows measure counts by health classification with color-coded badges.
 */

import React from 'react';
import { useData } from '../context/DataContext';
import { AlertTriangle, AlertCircle, CheckCircle, Star } from 'lucide-react';

interface HealthBadgeProps {
  count: number;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

const HealthBadge: React.FC<HealthBadgeProps> = ({ count, label, color, bgColor, icon }) => {
  if (count === 0) return null;

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-md text-sm font-medium"
      style={{ backgroundColor: bgColor, color }}
    >
      {icon}
      <span>{count}</span>
      <span className="hidden sm:inline text-xs opacity-80">{label}</span>
    </div>
  );
};

const PerformanceSummary: React.FC = () => {
  const { performanceResult, selectedMeasure, setSelectedMeasure, measureLabel } = useData();

  if (!performanceResult) {
    return null;
  }

  const { summary } = performanceResult;
  const { healthCounts, totalChannels: totalMeasures, overall, needsAttentionCount } = summary;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 px-4 py-2 bg-slate-800/50 border-b border-slate-700">
      {/* Health badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <HealthBadge
          count={healthCounts.critical}
          label="critical"
          color="#ef4444"
          bgColor="rgba(239, 68, 68, 0.15)"
          icon={<AlertCircle className="w-4 h-4" />}
        />
        <HealthBadge
          count={healthCounts.warning}
          label="warning"
          color="#f59e0b"
          bgColor="rgba(245, 158, 11, 0.15)"
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        <HealthBadge
          count={healthCounts.capable}
          label="capable"
          color="#22c55e"
          bgColor="rgba(34, 197, 94, 0.15)"
          icon={<CheckCircle className="w-4 h-4" />}
        />
        <HealthBadge
          count={healthCounts.excellent}
          label="excellent"
          color="#3b82f6"
          bgColor="rgba(59, 130, 246, 0.15)"
          icon={<Star className="w-4 h-4" />}
        />
      </div>

      {/* Summary stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="text-slate-400">
          <span className="font-medium text-slate-200">{totalMeasures}</span>{' '}
          {measureLabel.toLowerCase()}s
        </div>
        {needsAttentionCount > 0 && (
          <div className="text-amber-400">
            <span className="font-medium">{needsAttentionCount}</span> need attention
          </div>
        )}
        <div className="hidden md:block text-slate-400 border-l border-slate-600 pl-4">
          Avg Cpk:{' '}
          <span className="font-mono font-medium text-slate-200">{overall.meanCpk.toFixed(2)}</span>
        </div>

        {/* Clear selection button */}
        {selectedMeasure && (
          <button
            onClick={() => setSelectedMeasure(null)}
            className="text-xs text-slate-400 hover:text-slate-200 underline"
          >
            Clear selection
          </button>
        )}
      </div>
    </div>
  );
};

export default PerformanceSummary;
