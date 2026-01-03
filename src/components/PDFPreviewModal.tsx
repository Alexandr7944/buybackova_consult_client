import React, {useState} from 'react';
import {
    Modal,
    Box,
    IconButton,
    Typography,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {type ElementForExport, PDFExportService} from "@/utils/PDFExportService.ts";

interface PDFPreviewModalProps {
    open: boolean;
    onClose: () => void;
    reportContainerId: string;
    title: string;
    elements: ElementForExport[];
}

const modalStyle = {
    position:     'absolute' as const,
    top:          '50%',
    left:         '50%',
    transform:    'translate(-50%, -50%)',
    width:        '80%',
    maxWidth:     1200,
    height:       '90%',
    bgcolor:      'background.paper',
    boxShadow:    24,
    p:            4,
    borderRadius: 2,
    overflow:     'hidden'
};

export const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
                                                                    open,
                                                                    onClose,
                                                                    title,
                                                                    elements,
                                                                }) => {
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const generatePreview = async () => {
        try {
            setIsLoading(true);
            const pdfService = new PDFExportService({title});

            await pdfService.generatePDF(elements, title);
            const blob = pdfService.getBlob();
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);

        } catch (error) {
            console.error('Preview generation error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (open) {
            generatePreview();
        }
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [open]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                    <Typography variant="h6">
                        Предварительный просмотр PDF
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon/>
                    </IconButton>
                </Box>

                {isLoading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                        <CircularProgress/>
                        <Typography sx={{ml: 2}}>
                            Генерация предпросмотра...
                        </Typography>
                    </Box>
                ) : pdfUrl ? (
                    <Box sx={{height: 'calc(100% - 60px)'}}>
                        <iframe
                            src={pdfUrl}
                            style={{width: '100%', height: '100%', border: 'none'}}
                            title="PDF Preview"
                        />
                    </Box>
                ) : null}
            </Box>
        </Modal>
    );
};
