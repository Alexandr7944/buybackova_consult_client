import {useFetcher, useLoaderData} from "react-router-dom";
import {Breadcrumbs, Link, Paper, TableContainer, Table, TableBody, TableRow, TableCell, Divider} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import {useMemo,} from "react";
import {format} from "date-fns";
import {Chart} from "@/components/maturityLevel/Chart.tsx";
import type {ReportItem} from "@/pages/new-audits/shared/types.ts";
import type {Audit} from "@/pages/audits/shared/types.ts";
import type {Report} from "@/pages/audit-edit/shared/types.ts";
import {Description} from "@/components/Description.tsx";

export const AuditItem = () => {
    const auditValue = useLoaderData<Audit>();

    const fetcher = useFetcher<Report>();

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


    return (
        <>
            <Breadcrumbs
                aria-label="breadcrumb"
                className="no-print"
                sx={{paddingBottom: 2}}
            >
                <Link
                    underline="hover"
                    sx={{display: 'flex', alignItems: 'center'}}
                    color="inherit"
                    href="/"
                >
                    <HomeIcon sx={{mr: 0.5}} fontSize="inherit"/>
                    Объекты
                </Link>
                <Link
                    underline="hover"
                    sx={{display: 'flex', alignItems: 'center'}}
                    color="inherit"
                    href={`/object/${auditValue.objectId}`}
                >
                    Аудиты
                </Link>
            </Breadcrumbs>

            <TableContainer component={Paper} sx={{marginBottom: 8}}>
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

            <Description
                name="sectionDescription"
                value={auditValue.sectionDescription}
                saveChange={saveChange}
            />

            <Divider/>

            <Chart
                title="Анализ по категориям СХ-системы"
                reports={reports.category as ReportItem[]}
            />

            <Description
                name="categoryDescription"
                value={auditValue.categoryDescription}
                saveChange={saveChange}
            />

            <Divider/>

            <Description
                name="reportDescription"
                value={auditValue.reportDescription}
                saveChange={saveChange}
            />
        </>
    );
}
