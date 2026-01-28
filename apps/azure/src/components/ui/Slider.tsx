import React from 'react';

interface SliderProps {
  /** Label displayed above the slider */
  label: string;
  /** Current value */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Step increment */
  step: number;
  /** Format function for displaying the value */
  formatValue?: (value: number) => string;
  /** Additional className for the container */
  className?: string;
  /** Whether the slider is disabled */
  disabled?: boolean;
}

/**
 * Styled range slider component with label and value display
 *
 * Features:
 * - Tailwind styling for thumb/track (Azure slate palette)
 * - Keyboard accessibility (arrow keys, Home/End)
 * - Custom value formatting
 */
const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  formatValue,
  className = '',
  disabled = false,
}) => {
  const displayValue = formatValue ? formatValue(value) : value.toString();

  // Calculate percentage for track fill
  const percentage = max !== min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className={`${className}`}>
      {/* Label and value row */}
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-slate-400">{label}</label>
        <span className="text-xs font-mono text-white">{displayValue}</span>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className={`
            w-full h-2 rounded-full appearance-none cursor-pointer
            bg-slate-700
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-1 focus:ring-offset-slate-900
            disabled:opacity-50 disabled:cursor-not-allowed

            /* WebKit (Chrome, Safari) */
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-blue-500
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-blue-600
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:active:scale-95

            /* Firefox */
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-blue-500
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-blue-600
            [&::-moz-range-thumb]:shadow-md

            [&::-moz-range-track]:bg-slate-700
            [&::-moz-range-track]:rounded-full
            [&::-moz-range-track]:h-2
          `}
          style={{
            // Custom gradient for filled portion (WebKit)
            background: `linear-gradient(to right,
              rgb(59, 130, 246) 0%,
              rgb(59, 130, 246) ${percentage}%,
              rgb(51, 65, 85) ${percentage}%,
              rgb(51, 65, 85) 100%)`,
          }}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayValue}
        />
      </div>
    </div>
  );
};

export default Slider;
