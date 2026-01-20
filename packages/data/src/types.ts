/**
 * Sample dataset configuration for VariScout demos and case studies
 */
export interface SampleDataset {
  /** Display name */
  name: string;
  /** Brief description of the case/scenario */
  description: string;
  /** Lucide icon name */
  icon: string;
  /** URL-friendly key for ?sample= parameter */
  urlKey: string;
  /** Raw data records */
  data: Record<string, unknown>[];
  /** Analysis configuration */
  config: SampleConfig;
}

export interface SampleConfig {
  /** Column name for the measurement/outcome variable */
  outcome: string;
  /** Column names for factor/grouping variables */
  factors: string[];
  /** Specification limits */
  specs: SpecLimits;
  /** Optional grade definitions (e.g., coffee quality grades) */
  grades?: GradeDefinition[];
  /** Enable performance mode (multi-measure Cpk analysis) */
  performanceMode?: boolean;
  /** Column names for measure variables (wide format data) */
  measureColumns?: string[];
  // GageRR-specific configuration
  /** Column name for Part identifier (for Gage R&R) */
  partColumn?: string;
  /** Column name for Operator identifier (for Gage R&R) */
  operatorColumn?: string;
  /** Column name for Measurement value (for Gage R&R) */
  measurementColumn?: string;
}

export interface SpecLimits {
  /** Upper specification limit */
  usl?: number;
  /** Lower specification limit */
  lsl?: number;
  /** Target value */
  target?: number;
}

export interface GradeDefinition {
  /** Maximum value for this grade (exclusive upper bound) */
  max: number;
  /** Grade label */
  label: string;
  /** Display color (hex) */
  color: string;
}

/**
 * Pre-computed chart data for a sample dataset
 */
export interface ComputedChartData {
  /** URL key to match with SampleDataset */
  urlKey: string;
  /** I-Chart data points */
  ichartData: IChartPoint[];
  /** Boxplot grouped data */
  boxplotData: BoxplotGroup[];
  /** Pareto frequency data */
  paretoData: ParetoItem[];
  /** Pre-calculated statistics */
  stats: PrecomputedStats;
  /** Specs from the sample config */
  specs: SpecLimits;
  /** Pre-computed Gage R&R results (if sample has required structure) */
  gagerr?: GageRRData;
}

/**
 * Pre-computed Gage R&R data for charts
 * Subset of GageRRResult from @variscout/core
 */
export interface GageRRData {
  /** % contribution from Part-to-Part */
  pctPart: number;
  /** % contribution from Repeatability */
  pctRepeatability: number;
  /** % contribution from Reproducibility */
  pctReproducibility: number;
  /** Total %GRR */
  pctGRR: number;
  /** Overall assessment */
  verdict: 'excellent' | 'marginal' | 'unacceptable';
  /** Data for Operator × Part interaction chart */
  interactionData: GageRRInteractionData[];
}

/**
 * Interaction data point for Gage R&R interaction plot
 */
export interface GageRRInteractionData {
  /** Part identifier */
  part: string;
  /** Operator identifier */
  operator: string;
  /** Mean measurement for this Part × Operator combination */
  mean: number;
}

export interface IChartPoint {
  x: number;
  y: number;
  originalIndex: number;
  stage?: string;
}

export interface BoxplotGroup {
  key: string;
  values: number[];
  min: number;
  max: number;
  q1: number;
  median: number;
  q3: number;
  outliers: number[];
  mean?: number;
  variationPct?: number;
}

export interface ParetoItem {
  key: string;
  value: number;
  cumulative: number;
  cumulativePercentage: number;
}

export interface PrecomputedStats {
  n: number;
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  ucl: number;
  lcl: number;
  cp?: number;
  cpk?: number;
  outOfSpecPercentage: number;
}
