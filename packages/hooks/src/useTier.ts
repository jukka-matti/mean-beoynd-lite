/**
 * useTier - React hook for tier-based feature gating
 *
 * Provides easy access to tier information and channel limit validation.
 */

import { useMemo, useCallback } from 'react';
import {
  getTier,
  isPaidTier,
  getMaxChannels,
  validateChannelCount,
  getTierDescription,
  getUpgradeUrl,
  CHANNEL_WARNING_THRESHOLD,
  type LicenseTier,
  type ChannelLimitResult,
} from '@variscout/core';

/**
 * Result object from useTier hook
 */
export interface UseTierResult {
  /** Current license tier */
  tier: LicenseTier;
  /** Whether current tier is a paid tier */
  isPaid: boolean;
  /** Maximum channels allowed for current tier */
  maxChannels: number;
  /** Human-readable tier description */
  description: string;
  /** URL to upgrade in Azure Marketplace */
  upgradeUrl: string;
  /** Channel count threshold for performance warning */
  warningThreshold: number;

  /**
   * Validate a channel count against tier limits
   * @param count - Number of channels to validate
   * @returns Validation result with exceeded, current, max, and showWarning
   */
  validateChannels: (count: number) => ChannelLimitResult;

  /**
   * Get a warning message for channel count (if applicable)
   * @param count - Number of channels
   * @returns Warning message or null if no warning needed
   */
  getChannelWarning: (count: number) => ChannelWarningMessage | null;
}

/**
 * Channel limit warning message
 */
export interface ChannelWarningMessage {
  /** Warning type: 'exceeded' (hard limit) or 'performance' (soft warning) */
  type: 'exceeded' | 'performance';
  /** Warning title */
  title: string;
  /** Warning description */
  message: string;
  /** Whether to show upgrade link (for exceeded warnings on free tier) */
  showUpgrade: boolean;
}

/**
 * React hook for tier-based feature gating
 *
 * @returns UseTierResult with tier info and validation functions
 *
 * @example
 * const { tier, maxChannels, validateChannels, getChannelWarning } = useTier();
 *
 * // Check if channels can be analyzed
 * const validation = validateChannels(selectedColumns.length);
 * if (validation.exceeded) {
 *   // Show error and block action
 * } else if (validation.showWarning) {
 *   // Show performance warning
 * }
 *
 * // Get formatted warning message
 * const warning = getChannelWarning(channelCount);
 * if (warning) {
 *   showToast(warning.title, warning.message);
 * }
 */
export function useTier(): UseTierResult {
  // Get current tier (this will be updated when configureTier is called)
  const tier = getTier();

  // Memoize static values based on tier
  const staticValues = useMemo(
    () => ({
      tier,
      isPaid: isPaidTier(tier),
      maxChannels: getMaxChannels(tier),
      description: getTierDescription(tier),
      upgradeUrl: getUpgradeUrl(),
      warningThreshold: CHANNEL_WARNING_THRESHOLD,
    }),
    [tier]
  );

  // Validate channels function
  const validateChannels = useCallback(
    (count: number): ChannelLimitResult => {
      return validateChannelCount(count, tier);
    },
    [tier]
  );

  // Get warning message function
  const getChannelWarning = useCallback(
    (count: number): ChannelWarningMessage | null => {
      const validation = validateChannelCount(count, tier);

      if (validation.exceeded) {
        const isFree = tier === 'free';
        return {
          type: 'exceeded',
          title: isFree ? 'Free Tier Limit Reached' : 'Channel Limit Exceeded',
          message: isFree
            ? `Free tier is limited to ${validation.max} channels. Upgrade to analyze more.`
            : `Maximum ${validation.max} channels allowed. Please reduce your selection.`,
          showUpgrade: isFree,
        };
      }

      if (validation.showWarning) {
        return {
          type: 'performance',
          title: 'Performance Advisory',
          message: `Analyzing ${count} channels may affect browser performance. Consider analyzing fewer channels for a smoother experience.`,
          showUpgrade: false,
        };
      }

      return null;
    },
    [tier]
  );

  return {
    ...staticValues,
    validateChannels,
    getChannelWarning,
  };
}

export default useTier;
