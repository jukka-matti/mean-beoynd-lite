import React, { useEffect, useState } from 'react';
import VariationFunnel from './VariationFunnel';

/**
 * Storage key for cross-window data sync
 */
const FUNNEL_SYNC_KEY = 'variscout_funnel_sync';

interface FunnelSyncData {
  rawData: any[];
  factors: string[];
  outcome: string;
  columnAliases: Record<string, string>;
  timestamp: number;
}

/**
 * Standalone funnel window for dual-screen setups
 *
 * This component is rendered when the URL contains ?view=funnel
 * It receives data from the main window via localStorage sync.
 *
 * Communication pattern:
 * 1. Main window writes data to localStorage under FUNNEL_SYNC_KEY
 * 2. This window listens for storage events and updates its state
 * 3. Filter changes are communicated back via postMessage
 */
const FunnelWindow: React.FC = () => {
  const [syncData, setSyncData] = useState<FunnelSyncData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FUNNEL_SYNC_KEY);
      if (stored) {
        const data = JSON.parse(stored) as FunnelSyncData;
        setSyncData(data);
      } else {
        setError('No data available. Please open from the main VariScout window.');
      }
    } catch (e) {
      setError('Failed to load data from main window.');
    }
  }, []);

  // Listen for storage updates from main window
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FUNNEL_SYNC_KEY && e.newValue) {
        try {
          const data = JSON.parse(e.newValue) as FunnelSyncData;
          setSyncData(data);
          setError(null);
        } catch (err) {
          console.error('Failed to parse sync data:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Apply filters back to main window via postMessage
  const handleApplyFilters = (filters: Record<string, (string | number)[]>) => {
    // Try to find and message the opener window
    if (window.opener) {
      window.opener.postMessage({ type: 'FUNNEL_APPLY_FILTERS', filters }, window.location.origin);
    }
    // Also store in localStorage as a fallback
    localStorage.setItem(
      'variscout_funnel_filters',
      JSON.stringify({ filters, timestamp: Date.now() })
    );
  };

  // Drill to a specific factor/value
  const handleDrillFactor = (factor: string, value: string | number) => {
    const filters = { [factor]: [value] };
    handleApplyFilters(filters);
  };

  // Error state
  if (error) {
    return (
      <div className="h-screen w-screen bg-surface flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">:(</div>
          <h1 className="text-xl font-bold text-white mb-2">No Connection</h1>
          <p className="text-content-secondary text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (!syncData) {
    return (
      <div className="h-screen w-screen bg-surface flex items-center justify-center">
        <div className="animate-pulse text-content-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-surface">
      <VariationFunnel
        data={syncData.rawData}
        factors={syncData.factors}
        outcome={syncData.outcome}
        columnAliases={syncData.columnAliases}
        onApplyFilters={handleApplyFilters}
        onDrillFactor={handleDrillFactor}
        isPopout={true}
      />
    </div>
  );
};

export default FunnelWindow;

/**
 * Utility function to open the funnel in a popout window
 * Call this from the main app
 */
export function openFunnelPopout(
  data: any[],
  factors: string[],
  outcome: string,
  columnAliases: Record<string, string>
): Window | null {
  // Store data for the popout window
  const syncData: FunnelSyncData = {
    rawData: data,
    factors,
    outcome,
    columnAliases,
    timestamp: Date.now(),
  };
  localStorage.setItem(FUNNEL_SYNC_KEY, JSON.stringify(syncData));

  // Open the popout window
  const url = `${window.location.origin}${window.location.pathname}?view=funnel`;
  const popup = window.open(
    url,
    'variscout-funnel',
    'width=400,height=700,menubar=no,toolbar=no,location=no,status=no'
  );

  return popup;
}

/**
 * Utility function to update the funnel popout with new data
 * Call this when data changes in the main window
 */
export function updateFunnelPopout(
  data: any[],
  factors: string[],
  outcome: string,
  columnAliases: Record<string, string>
): void {
  const syncData: FunnelSyncData = {
    rawData: data,
    factors,
    outcome,
    columnAliases,
    timestamp: Date.now(),
  };
  localStorage.setItem(FUNNEL_SYNC_KEY, JSON.stringify(syncData));
}
