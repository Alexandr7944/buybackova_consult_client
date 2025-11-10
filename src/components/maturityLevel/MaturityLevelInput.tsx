import React, {useMemo, useState} from "react";
import {LevelSelect} from "./LevelSelect.tsx";
import type {Row, Section} from "@/pages/audits/shared/types.ts";
import type {Audit} from "@/pages/audits/shared/types.ts";
import {
    Accordion, AccordionDetails, AccordionSummary, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Paper, TextField,Container,
} from "@mui/material";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useNavigate} from "react-router-dom";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {ru} from 'date-fns/locale/ru';

export type FormState = Record<string, number>;

interface MaturityLevelProps {
    sections: Section[];
    audit: Audit;
    submitForm: (state: Audit) => void;
}

export const MaturityLevelInput: React.FC<MaturityLevelProps> = ({sections, audit, submitForm}) => {
    const [state, setState] = useState<FormState>(audit.formState);
    const [expanded, setExpanded] = useState<number[]>([]);
    const [date, setDate] = useState<Date>(new Date(audit.date || audit.createdAt));
    const [auditorName, setAuditorName] = useState<string>(audit.auditorName ?? "");
    const [ownerSignerName, setOwnerSignerName] = useState<string>(audit.ownerSignerName ?? "");

    const navigate = useNavigate();

    const handleLevelChange = (rowId: number, value: string | undefined) => {
        const numeric = value === undefined ? null : Number(value);
        setState((prev) => ({...prev, [rowId]: numeric}));
    };

    const title = ["Стандарт ISO 23592:2021", "Вопрос на аудите", "Вывод по итогам аудита",];

    function toggleSection(sectionId: number) {
        setExpanded((prev) =>
            prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
        );
    }

    const getProgress = useMemo(() => {
        return sections.reduce(
            (acc: Record<string, { result: number; total: number }>, section) => {
                const rowIds = section.rows.map((row) => row.id);
                const result = Object.entries(state)
                    .filter(([id, value]) => value !== null && (value as number) >= 0 && rowIds.includes(+id))
                    .length;

                const key = section.id.toString() as keyof typeof acc;
                acc[key] = {result, total: section.rows.length};
                return acc;
            },
            {}
        );
    }, [state, sections]);

    const saveForm = () => {
        setExpanded([]);
        const value = {id: audit.id} as Audit;
        if (JSON.stringify(state) !== JSON.stringify(audit.formState))
            value.formState = state;
        if (auditorName !== audit.auditorName)
            value.auditorName = auditorName;
        if (ownerSignerName !== audit.ownerSignerName)
            value.ownerSignerName = ownerSignerName;
        if (date !== audit.date)
            value.date = date;

        if (Object.keys(value).length > 1)
            submitForm(value);
    };

    const showReport = () => {
        saveForm();
        navigate(`/audit/${audit.id}`)
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h5" component="h1">
                Уровень развития системы
            </Typography>
            <Box mt={3}>
                <Box display="grid" gap={4} mb={8}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                        <DatePicker
                            label='Дата проведения аудита'
                            value={date}
                            onChange={(newValue) => newValue && setDate(newValue)}
                        />
                    </LocalizationProvider>
                    <TextField
                        variant='standard'
                        label="Имя аудитора"
                        value={auditorName}
                        onChange={(e) => setAuditorName(e.target.value)}
                        size="small"
                        fullWidth
                    />
                    <TextField
                        variant='standard'
                        label="Представитель заказчика"
                        value={ownerSignerName}
                        onChange={(e) => setOwnerSignerName(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Box>

                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {title.map((t, i) => (
                                    <TableCell key={t} sx={{
                                        textAlign:     i ? 'end' : 'center',
                                        textTransform: "uppercase",
                                        fontWeight:    'bold'
                                    }}>
                                        {t}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {sections.map((section) => (
                                <TableRow key={section.id}>
                                    <TableCell colSpan={3} sx={{p: 0, borderBottom: "none"}}>
                                        <Accordion
                                            elevation={0}
                                            expanded={expanded.includes(section.id)}
                                            onChange={() => toggleSection(section.id)}
                                        >
                                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                                <Box display="flex" alignItems="center" width="100%" gap={1}>
                                                    <Typography variant="subtitle1" sx={{flex: 1}}>
                                                        {section.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {getProgress[section.id]?.result ?? 0} / {getProgress[section.id]?.total ?? section.rows.length}
                                                    </Typography>
                                                </Box>
                                            </AccordionSummary>

                                            <AccordionDetails sx={{p: 0}}>
                                                <Table size="small">
                                                    <TableBody>
                                                        {section.rows.map((row: Row) => {
                                                            const value = state[row.id];
                                                            return (
                                                                <TableRow key={row.id}>
                                                                    <TableCell sx={{whiteSpace: "pre-wrap", verticalAlign: "top"}}>
                                                                        {row.standard}
                                                                    </TableCell>
                                                                    <TableCell sx={{whiteSpace: "pre-wrap", verticalAlign: "top"}}>
                                                                        {row.question}
                                                                    </TableCell>
                                                                    <TableCell sx={{verticalAlign: "top"}}>
                                                                        <LevelSelect
                                                                            value={value}
                                                                            handleLevelChange={(select) => handleLevelChange(row.id, select)}
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </AccordionDetails>
                                        </Accordion>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                    <Button variant="outlined" onClick={saveForm}>
                        Сохранить
                    </Button>
                    {audit.id > 0 &&
                        <Button variant="outlined" onClick={showReport}>
                            Отчет
                        </Button>
                    }
                </Box>
            </Box>
        </Container>
    );
};
