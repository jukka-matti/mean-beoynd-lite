import React from 'react';
import {
  Activity,
  Settings,
  Download,
  Save,
  FolderOpen,
  RefreshCw,
  HardDrive,
  FileSpreadsheet,
  Maximize2,
  Minimize2,
  Table,
} from 'lucide-react';

interface AppHeaderProps {
  currentProjectName: string | null;
  hasUnsavedChanges: boolean;
  hasData: boolean;
  isLargeMode: boolean;
  isSaving: boolean;
  onSaveToBrowser: () => void;
  onOpenProjects: () => void;
  onOpenDataTable: () => void;
  onDownloadFile: () => void;
  onExportCSV: () => void;
  onExportImage: () => void;
  onToggleLargeMode: () => void;
  onOpenSettings: () => void;
  onReset: () => void;
}

/**
 * Application header with logo, project name, and toolbar buttons
 * Shows different controls based on whether data is loaded
 */
const AppHeader: React.FC<AppHeaderProps> = ({
  currentProjectName,
  hasUnsavedChanges,
  hasData,
  isLargeMode,
  isSaving,
  onSaveToBrowser,
  onOpenProjects,
  onOpenDataTable,
  onDownloadFile,
  onExportCSV,
  onExportImage,
  onToggleLargeMode,
  onOpenSettings,
  onReset,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 bg-slate-900/50 backdrop-blur-md z-10">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
          <Activity className="text-white" size={18} />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
          <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            VariScout <span className="font-light text-slate-500">Lite</span>
          </h1>
          {currentProjectName && (
            <span className="text-[10px] sm:text-xs text-slate-500 truncate max-w-[120px] sm:max-w-none">
              {currentProjectName}
              {hasUnsavedChanges && ' *'}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {hasData && (
          <>
            {/* Save to browser button */}
            <button
              onClick={onSaveToBrowser}
              disabled={isSaving}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
              title="Save to Browser"
            >
              <HardDrive size={18} />
            </button>
            {/* Open saved projects */}
            <button
              onClick={onOpenProjects}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Open Saved Projects"
            >
              <FolderOpen size={18} />
            </button>
            {/* View Data Table */}
            <button
              onClick={onOpenDataTable}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="View Data"
            >
              <Table size={18} />
            </button>
            <div className="hidden sm:block h-4 w-px bg-slate-800 mx-1"></div>
            {/* Download as file */}
            <button
              onClick={onDownloadFile}
              className="hidden sm:flex p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Download as File"
            >
              <Save size={18} />
            </button>
            {/* Export as CSV */}
            <button
              onClick={onExportCSV}
              className="hidden sm:flex p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Export as CSV"
            >
              <FileSpreadsheet size={18} />
            </button>
            {/* Export image */}
            <button
              onClick={onExportImage}
              className="hidden sm:flex p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Export as Image"
            >
              <Download size={18} />
            </button>
            <div className="hidden sm:block h-4 w-px bg-slate-800 mx-1"></div>
            {/* Large Mode toggle */}
            <button
              onClick={onToggleLargeMode}
              className={`p-2 rounded-lg transition-colors ${
                isLargeMode
                  ? 'text-blue-400 bg-blue-400/10 hover:bg-blue-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isLargeMode ? 'Exit Large Mode' : 'Large Mode (for presentations)'}
            >
              {isLargeMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings size={18} />
            </button>
            {/* Reset */}
            <button
              onClick={onReset}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <RefreshCw size={14} />
              <span>Reset</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
