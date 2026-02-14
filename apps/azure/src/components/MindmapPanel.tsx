import React, { useEffect, useRef, useCallback } from 'react';
import { InvestigationMindmapBase } from '@variscout/charts';
import { useMindmapState } from '@variscout/hooks';
import type { FilterAction } from '@variscout/core';
import { toPng } from 'html-to-image';
import { MindmapPanelContent, mindmapPanelAzureColorScheme } from '@variscout/ui';

interface MindmapPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  factors: string[];
  outcome: string;
  filterStack: FilterAction[];
  specs?: { usl?: number; lsl?: number; target?: number };
  onDrillCategory: (factor: string, value: string | number) => void;
  onOpenPopout?: () => void;
}

/**
 * Azure MindmapPanel — inline flex panel (DataPanel pattern).
 * Uses shared MindmapPanelContent for header, mode toggle, and drill path.
 */
const MindmapPanel: React.FC<MindmapPanelProps> = ({
  isOpen,
  onClose,
  data,
  factors,
  outcome,
  filterStack,
  specs,
  onDrillCategory,
  onOpenPopout,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const mindmapRef = useRef<HTMLDivElement>(null);

  const {
    nodes,
    drillTrail,
    cumulativeVariationPct,
    interactionEdges,
    narrativeSteps,
    drillPath,
    mode,
    setMode,
    handleAnnotationChange,
  } = useMindmapState({ data, factors, outcome, filterStack, specs });

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCategorySelect = useCallback(
    (factor: string, value: string | number) => onDrillCategory(factor, value),
    [onDrillCategory]
  );

  const handleExportPng = useCallback(async () => {
    const node = mindmapRef.current;
    if (!node) return;
    const dataUrl = await toPng(node, {
      cacheBust: true,
      backgroundColor: '#0f172a',
      pixelRatio: 2,
    });
    const link = document.createElement('a');
    link.download = `investigation-${new Date().toISOString().split('T')[0]}.png`;
    link.href = dataUrl;
    link.click();
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Divider (matches DataPanel pattern) */}
      <div className="w-1 bg-slate-700 flex-shrink-0" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="flex-shrink-0 w-96 bg-slate-800 border-l border-slate-700 flex flex-col overflow-hidden"
      >
        <MindmapPanelContent
          mode={mode}
          setMode={setMode}
          drillPath={drillPath}
          onClose={onClose}
          onOpenPopout={onOpenPopout}
          onExportPng={handleExportPng}
          colorScheme={mindmapPanelAzureColorScheme}
        >
          <div ref={mindmapRef} className="flex-1 overflow-hidden px-2 py-2">
            <InvestigationMindmapBase
              nodes={nodes}
              drillTrail={drillTrail}
              cumulativeVariationPct={cumulativeVariationPct}
              onNodeClick={() => {}}
              onCategorySelect={handleCategorySelect}
              mode={mode}
              edges={interactionEdges}
              narrativeSteps={narrativeSteps}
              onAnnotationChange={handleAnnotationChange}
              width={368}
              height={500}
            />
          </div>
        </MindmapPanelContent>
      </div>
    </>
  );
};

export default MindmapPanel;
