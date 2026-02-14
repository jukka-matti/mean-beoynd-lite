import React, { forwardRef } from 'react';
import {
  WhatIfSimulator as WhatIfSimulatorBase,
  whatIfSimulatorAzureColorScheme,
  type WhatIfSimulatorProps,
  type WhatIfSimulatorHandle,
} from '@variscout/ui';

/**
 * Azure WhatIfSimulator — wraps @variscout/ui with Azure slate color scheme.
 */
const WhatIfSimulator = forwardRef<
  WhatIfSimulatorHandle,
  Omit<WhatIfSimulatorProps, 'colorScheme'>
>((props, ref) => (
  <WhatIfSimulatorBase ref={ref} {...props} colorScheme={whatIfSimulatorAzureColorScheme} />
));

WhatIfSimulator.displayName = 'WhatIfSimulator';

export default WhatIfSimulator;
export type { WhatIfSimulatorProps, WhatIfSimulatorHandle };
export type { SimulatorPreset } from '@variscout/ui';
