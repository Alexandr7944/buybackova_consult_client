import {useLoaderData} from "react-router-dom";
import {Paper, TableContainer, Table, TableBody, TableRow, TableCell} from "@mui/material";
import {useMemo} from "react";
import {Chart} from "@/components/maturityLevel/Chart.tsx";
import {format} from "date-fns";
import type {ReportItem} from "@/pages/new-audits/shared/types.ts";
import type {Audit} from "@/pages/audits/shared/types.ts";

export const AuditItem = () => {
    const auditValue = useLoaderData<Audit>();

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


    return (
        <div>
            {/*<pre>{JSON.stringify(auditValue, null, 2)}</pre>*/}
            {/*<pre>{JSON.stringify(reports, null, 2)}</pre>*/}
            <TableContainer component={Paper}>
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

            <Chart
                title="Анализ по разделам стандарта ISO 23592:2021"
                reports={reports.section as ReportItem[]}
            />
            <p>{auditValue.sectionDescription}</p>

            <Chart
                title="Анализ по категориям СХ-системы"
                reports={reports.category as ReportItem[]}
            />
            <p>{auditValue.categoryDescription}</p>
            <p>{auditValue.reportDescription}</p>
        </div>
    );
}
