import { useCallback } from 'react';
import { useData } from '../context/DataContext';
import { parseCSV, parseExcel, detectColumns } from '../logic/parser';
import { SampleDataset } from '../data/sampleData';

export const useDataIngestion = () => {
    const { setRawData, setOutcome, setFactors, setSpecs, setGrades, setFilters } = useData();

    const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        let data: any[] = [];
        try {
            if (file.name.endsWith('.csv')) {
                data = await parseCSV(file);
            } else if (file.name.endsWith('.xlsx')) {
                data = await parseExcel(file);
            }

            if (data.length > 0) {
                setRawData(data);
                const detected = detectColumns(data);
                if (detected.outcome) setOutcome(detected.outcome);
                if (detected.factors.length > 0) setFactors(detected.factors);
            }
        } catch (error) {
            console.error("Error parsing file:", error);
            alert("Error parsing file. Please check format.");
        }
    }, [setRawData, setOutcome, setFactors]);

    const loadSample = useCallback((sample: SampleDataset) => {
        setRawData(sample.data);
        setOutcome(sample.config.outcome);
        setFactors(sample.config.factors);
        setSpecs(sample.config.specs);
        setGrades(sample.config.grades || []);
    }, [setRawData, setOutcome, setFactors, setSpecs, setGrades]);

    const clearData = useCallback(() => {
        setRawData([]);
        setOutcome('');
        setFactors([]);
        setSpecs({});
        setGrades([]);
        setFilters({});
    }, [setRawData, setOutcome, setFactors, setSpecs, setGrades, setFilters]);

    return {
        handleFileUpload,
        loadSample,
        clearData
    };
};
