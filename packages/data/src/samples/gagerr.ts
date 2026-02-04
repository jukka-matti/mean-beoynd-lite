import type { SampleDataset } from '../types';

/**
 * Gage R&R Sample Dataset
 *
 * Measurement system analysis study with:
 * - 5 parts (measured multiple times)
 * - 3 operators (different people measuring)
 * - 3 replicates (each operator measures each part 3 times)
 *
 * This is a standard crossed Gage R&R design (45 total measurements).
 * The data shows moderate repeatability and reproducibility variation,
 * suitable for demonstrating MSA concepts.
 */

// Generate realistic measurement data for Gage R&R study
const generateGageRRData = () => {
  const parts = ['P1', 'P2', 'P3', 'P4', 'P5'];
  const operators = ['A', 'B', 'C'];
  const replicates = 3;

  // True part values (the actual size of each part)
  const partTrueValues: Record<string, number> = {
    P1: 10.02,
    P2: 9.85,
    P3: 10.15,
    P4: 9.92,
    P5: 10.08,
  };

  // Operator bias (systematic difference between operators)
  const operatorBias: Record<string, number> = {
    A: 0.0, // Operator A is calibrated
    B: 0.02, // Operator B reads slightly high
    C: -0.01, // Operator C reads slightly low
  };

  // Random equipment variation (repeatability)
  const equipmentStdDev = 0.015;

  const data: Record<string, unknown>[] = [];

  // Use seeded pseudo-random for reproducibility
  let seed = 42;
  const random = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  // Box-Muller transform for normal distribution
  const randomNormal = (mean: number, stdDev: number) => {
    const u1 = random();
    const u2 = random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stdDev;
  };

  for (const part of parts) {
    for (const operator of operators) {
      for (let rep = 0; rep < replicates; rep++) {
        const trueValue = partTrueValues[part];
        const bias = operatorBias[operator];
        const noise = randomNormal(0, equipmentStdDev);
        const measurement = trueValue + bias + noise;

        data.push({
          Part: part,
          Operator: operator,
          Replicate: rep + 1,
          Measurement: Math.round(measurement * 1000) / 1000,
        });
      }
    }
  }

  return data;
};

export const gagerr: SampleDataset = {
  name: 'Gage R&R Study',
  description:
    'Measurement system analysis - 5 parts measured by 3 operators with 3 replicates each.',
  icon: 'ruler',
  urlKey: 'gagerr',
  category: 'standard',
  featured: false,
  data: generateGageRRData(),
  config: {
    outcome: 'Measurement',
    factors: ['Part', 'Operator'],
    specs: { lsl: 9.5, target: 10.0, usl: 10.5 },
    // GageRR-specific configuration
    partColumn: 'Part',
    operatorColumn: 'Operator',
    measurementColumn: 'Measurement',
  },
};
