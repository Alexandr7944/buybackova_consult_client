import {useFetcher, useLoaderData, useNavigate} from "react-router-dom";
import {Stack, Paper, TableContainer, Table, TableBody, TableRow, TableCell, Divider, Button} from "@mui/material";
import {useMemo, useRef, useState,} from "react";
import {format} from "date-fns";
import {Chart} from "@/components/maturityLevel/Chart.tsx";
import type {Audit, Report, ReportItem} from "@/pages/audits/shared/types.ts";
import {Description} from "@/components/Description.tsx";
import {BreadcrumbsRow} from "@/components/BreadcrumbsRow.tsx";
import {getBaseUrl} from "@/shared/api.ts";
import {PDFPreviewModal} from "@/components/PDFPreviewModal.tsx";
import type EChartsReact from "echarts-for-react";
import {PDFExportButton} from "@/components/PdfExportButton.tsx";
import type {ElementForExport} from "@/utils/PDFExportService.ts";

export const AuditItem = () => {
    const auditValue = useLoaderData<Audit>();
    const navigate = useNavigate();
    const fetcher = useFetcher<Report>();
    const [showPDF, setShowPDF] = useState(false);

    const tableContainer = useRef<HTMLDivElement>(null);
    const chart1Ref = useRef<EChartsReact>(null);
    const description1Ref = useRef<HTMLDivElement>(null);
    const chart2Ref = useRef<EChartsReact>(null);
    const description2Ref = useRef<HTMLDivElement>(null);
    const descriptionRef = useRef<HTMLDivElement>(null);
    const chartRefs = [chart1Ref, chart2Ref];

    const exportElements: ElementForExport[] = [
        {type: 'table', ref: tableContainer},
        {type: 'chart', ref: chart1Ref},
        {type: 'content', ref: description1Ref},
        {type: 'chart', ref: chart2Ref},
        {type: 'content', ref: description2Ref},
        {type: 'content', ref: descriptionRef},
    ]

    const columns = [
        {title: "Название объекта", value: auditValue.object.name},
        {title: "Адрес объекта", value: auditValue.object.address},
        {title: "Аудитор", value: auditValue.auditorName},
        {title: "Представитель заказчика", value: auditValue.ownerSignerName},
        {title: 'Дата оценки: ', value: format(auditValue.date, 'dd.MM.yyyy')},
        {title: "Общая оценка уровня развития системы управления клиентским опытом", value: auditValue.resultValue},
        {title: "Уровень зрелости", value: auditValue.resultDescription},
    ];

    const reports = useMemo(
        () => Object.groupBy(auditValue?.results, (result) => result.type),
        [auditValue.results]
    )

    const saveChange = async (data: { [name: string]: string | null }) => {
        if (Object.keys(data).length) {
            const formData = new FormData();
            formData.set("editState", JSON.stringify({id: auditValue.id, ...data,}));

            await fetcher.submit(formData, {method: "PATCH"});
        }
    }

    const downloadPath = `${getBaseUrl()}/audits/report-xlsx/${auditValue.id}`;

    return (
        <>
            <BreadcrumbsRow
                name="Протокол аудита"
                links={[{href: `/object/${auditValue.objectId}`, name: 'Аудиты'}]}
            />

            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{marginTop: 3, marginBottom: 3}}>
                <Button
                    className="no-print"
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/audit/${auditValue.id}/edit`)}
                >
                    Редактировать
                </Button>
                <Button variant="outlined" color="primary" onClick={() => setShowPDF(true)}>
                    Предпросмотр
                </Button>
                <a href={downloadPath} className="no-print">
                    <Button variant="contained" color="primary">
                        Экспорт Excel
                    </Button>
                </a>
                <PDFExportButton
                    reportContainerId="report-content"
                    chartRefs={chartRefs}
                    title="Аналитический отчет по объектам"
                    fileName="аналитический_отчет.pdf"
                    elements={exportElements}
                />
            </Stack>
            <PDFPreviewModal
                title={`Протокол аудита ${auditValue.object.name} ${format(auditValue.date, 'dd.MM.yyyy')}`}
                open={showPDF}
                reportContainerId="report-content"
                elements={exportElements}
                onClose={() => setShowPDF(false)}
            />
            <div
                id="report-content"
                className="p-4"
                style={{backgroundColor: 'white'}}
            >
                <TableContainer ref={tableContainer} component={Paper} sx={{marginBottom: 8, marginTop: 3}}>
                    <Table sx={{minWidth: 650}} aria-label="objects table">
                        <TableBody>
                            {
                                columns.map(({title, value}) => (
                                    <TableRow
                                        key={title}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell>{title}</TableCell>
                                        <TableCell>{value}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

                {reports.section && <Chart
                    ref={chart1Ref}
                    title="Анализ по разделам стандарта ISO 23592:2021"
                    reports={reports.section as ReportItem[]}
                />}

                <Description
                    ref={description1Ref}
                    name="sectionDescription"
                    value={auditValue.sectionDescription}
                    saveChange={saveChange}
                />

                <Divider/>

                {reports.category && <Chart
                    ref={chart2Ref}
                    title="Анализ по категориям СХ-системы"
                    reports={reports.category as ReportItem[]}
                />}

                <Description
                    ref={description2Ref}
                    name="categoryDescription"
                    value={auditValue.categoryDescription}
                    saveChange={saveChange}
                />

                <Divider/>

                <Description
                    ref={descriptionRef}
                    name="reportDescription"
                    value={auditValue.reportDescription}
                    saveChange={saveChange}
                />
            </div>
        </>
    );
}
