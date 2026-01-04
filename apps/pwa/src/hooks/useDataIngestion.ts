import { useCallback } from 'react';
import { useData } from '../context/DataContext';
import {
  parseCSV,
  parseExcel,
  detectColumns,
  validateData,
  parseParetoFile,
} from '../logic/parser';
import { SampleDataset } from '../data/sampleData';

// Performance thresholds
const ROW_WARNING_THRESHOLD = 5000;
const ROW_HARD_LIMIT = 50000;

export const useDataIngestion = () => {
  const {
    setRawData,
    setOutcome,
    setFactors,
    setSpecs,
    setGrades,
    setFilters,
    setDataFilename,
    setDataQualityReport,
    setParetoMode,
    setSeparateParetoData,
    setSeparateParetoFilename,
  } = useData();

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<boolean> => {
      const file = e.target.files?.[0];
      if (!file) return false;

      let data: any[] = [];
      try {
        if (file.name.endsWith('.csv')) {
          data = await parseCSV(file);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          data = await parseExcel(file);
        }

        if (data.length > 0) {
          // Check row limits for performance
          if (data.length > ROW_HARD_LIMIT) {
            alert(
              `File too large (${data.length.toLocaleString()} rows). Maximum is ${ROW_HARD_LIMIT.toLocaleString()} rows.`
            );
            return false;
          }
          if (data.length > ROW_WARNING_THRESHOLD) {
            const proceed = window.confirm(
              `Large dataset (${data.length.toLocaleString()} rows) may slow performance. Continue?`
            );
            if (!proceed) return false;
          }

          setRawData(data);
          setDataFilename(file.name);

          // Detect columns with enhanced keyword matching
          const detected = detectColumns(data);
          if (detected.outcome) setOutcome(detected.outcome);
          if (detected.factors.length > 0) setFactors(detected.factors);

          // Run validation and store report
          const report = validateData(data, detected.outcome);
          setDataQualityReport(report);

          return true;
        }
        return false;
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error parsing file. Please check format.');
        return false;
      }
    },
    [setRawData, setDataFilename, setOutcome, setFactors, setDataQualityReport]
  );

  // Handle separate Pareto file upload
  const handleParetoFileUpload = useCallback(
    async (file: File): Promise<boolean> => {
      try {
        const paretoData = await parseParetoFile(file);
        setSeparateParetoData(paretoData);
        setSeparateParetoFilename(file.name);
        setParetoMode('separate');
        return true;
      } catch (error) {
        console.error('Error parsing Pareto file:', error);
        alert(error instanceof Error ? error.message : 'Error parsing Pareto file.');
        return false;
      }
    },
    [setSeparateParetoData, setSeparateParetoFilename, setParetoMode]
  );

  // Clear separate Pareto data and switch back to derived mode
  const clearParetoFile = useCallback(() => {
    setSeparateParetoData(null);
    setSeparateParetoFilename(null);
    setParetoMode('derived');
  }, [setSeparateParetoData, setSeparateParetoFilename, setParetoMode]);

  const loadSample = useCallback(
    (sample: SampleDataset) => {
      setRawData(sample.data);
      setDataFilename(sample.name);
      setOutcome(sample.config.outcome);
      setFactors(sample.config.factors);
      setSpecs(sample.config.specs);
      setGrades(sample.config.grades || []);
      // Run validation for sample data too
      const report = validateData(sample.data, sample.config.outcome);
      setDataQualityReport(report);
      // Reset Pareto to derived mode
      setParetoMode('derived');
      setSeparateParetoData(null);
      setSeparateParetoFilename(null);
    },
    [
      setRawData,
      setDataFilename,
      setOutcome,
      setFactors,
      setSpecs,
      setGrades,
      setDataQualityReport,
      setParetoMode,
      setSeparateParetoData,
      setSeparateParetoFilename,
    ]
  );

  const clearData = useCallback(() => {
    setRawData([]);
    setDataFilename(null);
    setOutcome('');
    setFactors([]);
    setSpecs({});
    setGrades([]);
    setFilters({});
    setDataQualityReport(null);
    setParetoMode('derived');
    setSeparateParetoData(null);
    setSeparateParetoFilename(null);
  }, [
    setRawData,
    setDataFilename,
    setOutcome,
    setFactors,
    setSpecs,
    setGrades,
    setFilters,
    setDataQualityReport,
    setParetoMode,
    setSeparateParetoData,
    setSeparateParetoFilename,
  ]);

  return {
    handleFileUpload,
    handleParetoFileUpload,
    clearParetoFile,
    loadSample,
    clearData,
  };
};
