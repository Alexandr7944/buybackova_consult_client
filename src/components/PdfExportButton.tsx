import React, {useState} from 'react';
import {Button, CircularProgress, Snackbar, Alert, Box, LinearProgress} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EChartsReact from 'echarts-for-react';
import {type ElementForExport, PDFExportService} from "@/utils/PDFExportService.ts";

interface PDFExportButtonProps {
    reportContainerId: string;
    chartRefs: React.RefObject<EChartsReact | null>[];
    title: string;
    fileName?: string;
    onExportStart?: () => void;
    onExportComplete?: (pdfData?: string) => void;
    onExportError?: (error: Error) => void;
    showProgress?: boolean;
    elements: ElementForExport[];
}

export const PDFExportButton: React.FC<PDFExportButtonProps> = ({
                                                                    reportContainerId,
                                                                    chartRefs,
                                                                    title,
                                                                    fileName = 'отчет.pdf',
                                                                    onExportStart,
                                                                    onExportComplete,
                                                                    onExportError,
                                                                    showProgress = false,
                                                                    elements,
                                                                }) => {
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const updateProgress = (step: number, totalSteps: number) => {
        if (showProgress) {
            setProgress(Math.round((step / totalSteps) * 100));
        }
    };

    const handleExport = async () => {
        try {
            setIsExporting(true);
            setProgress(0);
            setError(null);
            onExportStart?.();

            // Шаг 1: Подготовка данных
            updateProgress(1, 6);
            await new Promise(resolve => setTimeout(resolve, 100));

            const reportElement = document.getElementById(reportContainerId);

            if (!reportElement) {
                throw new Error(`Элемент с ID ${reportContainerId} не найден`);
            }

            // Шаг 2: Ожидание загрузки графиков
            updateProgress(2, 6);
            await Promise.all(
                chartRefs.map(async (chartRef) => {
                    if (chartRef.current) {
                        const chartInstance = chartRef.current.getEchartsInstance();
                        return new Promise<void>((resolve) => {
                            const checkReady = () => {
                                if (chartInstance.isDisposed()) {
                                    resolve();
                                    return;
                                }
                                try {
                                    chartInstance.on('finished', () => resolve());
                                    setTimeout(resolve, 500); // Fallback timeout
                                } catch (e) {
                                    resolve();
                                }
                            };
                            checkReady();
                        });
                    }
                })
            );

            // Шаг 3: Создание PDF сервиса
            updateProgress(3, 6);
            const pdfService = new PDFExportService({title});

            // Шаг 4: Генерация PDF с контентом
            updateProgress(4, 6);
            await pdfService.generatePDF(elements, title);

            // Шаг 5: Сохранение
            updateProgress(5, 6);
            pdfService.save(fileName);

            // Шаг 6: Завершение
            updateProgress(6, 6);
            const pdfData = pdfService.getDataURL();
            onExportComplete?.(pdfData);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
            setError(`Ошибка при экспорте: ${errorMessage}`);
            onExportError?.(err as Error);
            console.error('Export error:', err);
        } finally {
            setIsExporting(false);
            setProgress(0);
        }
    };

    const handleCloseError = () => {
        setError(null);
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Button
                variant="contained"
                color="primary"
                startIcon={isExporting ? <CircularProgress size={20} color="inherit"/> : <PictureAsPdfIcon/>}
                onClick={handleExport}
                disabled={isExporting}
                className="no-print"
                sx={{minWidth: 200}}
            >
                {isExporting ? 'Экспорт...' : 'Экспорт в PDF'}
            </Button>

            {showProgress && isExporting && (
                <Box sx={{width: '100%', mt: 1}}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{height: 8, borderRadius: 4}}
                    />
                    <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 0.5}}>
                        <span style={{fontSize: 12}}>Прогресс:</span>
                        <span style={{fontSize: 12, fontWeight: 'bold'}}>{progress}%</span>
                    </Box>
                </Box>
            )}

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{width: '100%'}}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};
