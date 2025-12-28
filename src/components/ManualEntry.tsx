import React, { useState } from 'react';
import { ArrowRight, Play, Plus, Trash2, RotateCcw, Clipboard } from 'lucide-react';

interface ManualEntryProps {
    onAnalyze: (data: any[], config: { outcome: string; factors: string[] }) => void;
    onCancel: () => void;
}

const ManualEntry = ({ onAnalyze, onCancel }: ManualEntryProps) => {
    const [step, setStep] = useState<'setup' | 'grid'>('setup');

    // Config State
    const [outcomeName, setOutcomeName] = useState('Weight');
    const [factors, setFactors] = useState<string[]>(['Operator', 'Machine']);

    // Grid State
    const [rows, setRows] = useState<Record<string, string>[]>([]);

    // Setup Helpers
    const addFactor = () => setFactors([...factors, `Factor ${factors.length + 1}`]);
    const removeFactor = (idx: number) => setFactors(factors.filter((_, i) => i !== idx));
    const updateFactor = (idx: number, val: string) => {
        const newFactors = [...factors];
        newFactors[idx] = val;
        setFactors(newFactors);
    };

    // Grid Helpers
    const addRow = () => {
        const newRow: Record<string, string> = { [outcomeName]: '' };
        factors.forEach(f => newRow[f] = '');
        setRows([...rows, newRow]);
    };

    const updateRow = (idx: number, col: string, val: string) => {
        const newRows = [...rows];
        newRows[idx] = { ...newRows[idx], [col]: val };
        setRows(newRows);
    };

    const deleteRow = (idx: number) => {
        setRows(rows.filter((_, i) => i !== idx));
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
            const newRows = lines.map(line => {
                const values = line.split(/\t/); // Assume tab-separated like Excel
                const row: Record<string, string> = {};

                // Try to map values to columns in order: Factors... then Outcome? 
                // Or just assume order: Factor 1, Factor 2, ..., Outcome
                // Let's stick to simple mapping for now:
                // If we match column count, great.
                const cols = [...factors, outcomeName];
                cols.forEach((col, i) => {
                    if (values[i]) row[col] = values[i].trim();
                    else row[col] = '';
                });
                return row;
            });
            setRows([...rows, ...newRows]);
        } catch (err) {
            console.error('Failed to paste:', err);
            alert('Could not paste from clipboard. Please allow permissions.');
        }
    };

    const handleAnalyze = () => {
        // Filter empty rows
        const validRows = rows.filter(r => r[outcomeName] && r[outcomeName] !== '');

        // Convert outcome to number
        const formattedData = validRows.map(r => ({
            ...r,
            [outcomeName]: parseFloat(r[outcomeName])
        }));

        onAnalyze(formattedData, { outcome: outcomeName, factors });
    };

    // --- RENDER STEPS ---

    if (step === 'setup') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-200 p-8">
                <div className="w-full max-w-lg bg-slate-800 rounded-xl border border-slate-700 p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Step 1: What are you measuring?</h2>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-400 mb-2">Outcome (Y)</label>
                        <input
                            type="text"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={outcomeName}
                            onChange={(e) => setOutcomeName(e.target.value)}
                            placeholder="e.g. Weight, Diameter, pH"
                        />
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-semibold text-slate-400">Factors (X)</label>
                            <button onClick={addFactor} className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                                <Plus size={14} /> Add Factor
                            </button>
                        </div>
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                            {factors.map((f, i) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={f}
                                        onChange={(e) => updateFactor(i, e.target.value)}
                                        placeholder={`Factor ${i + 1}`}
                                    />
                                    {factors.length > 1 && (
                                        <button onClick={() => removeFactor(i)} className="text-slate-500 hover:text-red-400 p-2">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-700">
                        <button onClick={onCancel} className="flex-1 px-4 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition">
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                // Initialize first row
                                if (rows.length === 0) addRow();
                                setStep('grid');
                            }}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/20"
                        >
                            Start Entry <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // GRID STEP
    const columns = [...factors, outcomeName];

    return (
        <div className="flex flex-col h-screen bg-slate-900 text-slate-200">
            {/* Header */}
            <div className="flex-none p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => setStep('setup')} className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 border border-slate-600">
                        <RotateCcw size={16} className="text-slate-400" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-white">Manual Entry</h2>
                        <div className="text-xs text-slate-400">Targeting: <span className="text-blue-400">{outcomeName}</span></div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={handlePaste} className="px-3 py-2 rounded-lg border border-slate-600 text-slate-300 text-sm hover:bg-slate-700 flex items-center gap-2">
                        <Clipboard size={16} /> Paste Data
                    </button>
                    <button onClick={onCancel} className="px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={handleAnalyze}
                        className="bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg px-6 py-2 flex items-center gap-2 shadow-lg shadow-green-900/20"
                    >
                        <Play size={18} fill="currentColor" /> Analyze
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto p-8">
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl max-w-5xl mx-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-700">
                                <th className="p-3 w-12 text-center text-slate-500 font-normal">#</th>
                                {factors.map((f, i) => (
                                    <th key={i} className="p-3 text-slate-400 font-semibold border-r border-slate-700/50">{f} (X)</th>
                                ))}
                                <th className="p-3 text-blue-400 font-bold bg-blue-900/10 border-l border-slate-700">{outcomeName} (Y)</th>
                                <th className="w-12"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 group">
                                    <td className="p-3 text-center text-slate-600 font-mono text-sm">{idx + 1}</td>
                                    {factors.map((f, i) => (
                                        <td key={i} className="p-0 border-r border-slate-700/50">
                                            <input
                                                className="w-full bg-transparent p-3 text-white outline-none focus:bg-slate-700/50 transition-colors"
                                                value={row[f] || ''}
                                                onChange={(e) => updateRow(idx, f, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        // Move to next input or add row?
                                                    }
                                                }}
                                                placeholder="..."
                                            />
                                        </td>
                                    ))}
                                    <td className="p-0 bg-blue-900/5 border-l border-slate-700">
                                        <input
                                            className="w-full bg-transparent p-3 text-white font-mono outline-none focus:bg-blue-900/20 transition-colors text-right"
                                            value={row[outcomeName] || ''}
                                            onChange={(e) => updateRow(idx, outcomeName, e.target.value)}
                                            type="number"
                                            placeholder="0.00"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && idx === rows.length - 1) {
                                                    addRow();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td className="p-0 text-center">
                                        <button
                                            onClick={() => deleteRow(idx)}
                                            className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        onClick={addRow}
                        className="w-full p-3 text-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors border-t border-slate-700 text-sm font-semibold flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Add Row
                    </button>
                </div>

                <div className="max-w-5xl mx-auto mt-4 text-center text-slate-500 text-sm">
                    Is the last input focused? Press <kbd className="bg-slate-800 px-1 rounded border border-slate-600 font-mono text-xs">Enter</kbd> to add a new row instantly.
                </div>
            </div>
        </div>
    );
};

export default ManualEntry;
