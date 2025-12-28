import React from 'react';
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { StatsResult } from '../logic/stats';

interface StatsPanelProps {
    stats: StatsResult | null;
    specs: { usl?: number; lsl?: number; target?: number };
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, specs }) => {
    return (
        <div className="w-full lg:w-80 bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col gap-4 shadow-lg">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700 pb-2">Analysis Summary</h3>

            <div className="space-y-4">
                {/* Grade Summary Mode (Coffee/Textiles) */}
                {stats?.gradeCounts && stats.gradeCounts.length > 0 ? (
                    <div className="space-y-3">
                        {stats.gradeCounts.map((grade, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-slate-700/30 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: grade.color }}></div>
                                    <span className="text-slate-300 text-sm font-medium">{grade.label}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-500 text-xs">{grade.count}</span>
                                    <span className="text-white font-bold">{grade.percentage.toFixed(1)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Standard Cp/Cpk Mode */
                    <>
                        <div className="flex items-center justify-between p-2 rounded hover:bg-slate-700/30 transition-colors">
                            <div className="flex items-center gap-2 text-slate-300">
                                <CheckCircle2 size={18} className="text-green-500" />
                                <span>Pass Rate</span>
                            </div>
                            <span className="text-xl font-bold text-white">{(100 - (stats?.outOfSpecPercentage || 0)).toFixed(1)}%</span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded hover:bg-slate-700/30 transition-colors">
                            <div className="flex items-center gap-2 text-slate-300">
                                <TrendingUp size={18} className="text-blue-400" />
                                <span>Cpk</span>
                            </div>
                            <span className={`text-xl font-bold ${stats?.cpk && stats.cpk < 1.33 ? 'text-yellow-500' : 'text-green-500'}`}>
                                {stats?.cpk?.toFixed(2) || 'N/A'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-700 pt-4 p-2">
                            <div className="flex items-center gap-2 text-slate-300">
                                <AlertCircle size={18} className="text-red-400" />
                                <span>Rejected</span>
                            </div>
                            <span className="text-xl font-bold text-red-400">{stats?.outOfSpecPercentage.toFixed(1)}%</span>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-auto p-4 bg-slate-900/80 rounded-lg text-xs text-slate-500 border border-slate-800">
                {specs.usl && <div className="flex justify-between"><span>USL:</span> <span className="font-mono text-slate-400">{specs.usl}</span></div>}
                {specs.lsl && <div className="flex justify-between"><span>LSL:</span> <span className="font-mono text-slate-400">{specs.lsl}</span></div>}
                {!specs.usl && !specs.lsl && <div className="italic text-center">No specs defined.</div>}
            </div>
        </div>
    );
};

export default StatsPanel;
