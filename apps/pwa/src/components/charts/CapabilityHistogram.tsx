/**
 * CapabilityHistogram - PWA wrapper for shared chart component
 *
 * Thin wrapper that adds edition-aware branding to the shared CapabilityHistogramBase.
 */
import React from 'react';
import { CapabilityHistogramBase } from '@variscout/charts';
import { withParentSize } from '@visx/responsive';
import { shouldShowBranding, getBrandingText } from '../../lib/edition';

interface CapabilityHistogramProps {
  parentWidth: number;
  parentHeight: number;
  data: number[];
  specs: { usl?: number; lsl?: number; target?: number };
  mean: number;
}

const CapabilityHistogram = ({
  parentWidth,
  parentHeight,
  data,
  specs,
  mean,
}: CapabilityHistogramProps) => {
  const showBranding = shouldShowBranding();

  return (
    <CapabilityHistogramBase
      parentWidth={parentWidth}
      parentHeight={parentHeight}
      data={data}
      specs={specs}
      mean={mean}
      showBranding={showBranding}
      brandingText={showBranding ? getBrandingText() : undefined}
    />
  );
};

export default withParentSize(CapabilityHistogram);
