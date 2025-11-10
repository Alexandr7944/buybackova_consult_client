import {useFetcher, useLoaderData, useNavigate} from "react-router-dom";
import {Button, Tooltip, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import type {AuditableObject} from "@/pages/audits/shared/types.ts";
import type {Audit} from "@/pages/audits/shared/types.ts";
import {format} from "date-fns";
import EditIcon from '@mui/icons-material/edit';
import DeleteIcon from '@mui/icons-material/delete';

export const AuditList = () => {
    const auditedObject = useLoaderData<AuditableObject>();
    const navigate = useNavigate();
    const fetcher = useFetcher();

    const columns = [
        {title: 'Уровень зрелости', value: 'resultDescription',},
        {title: 'Общая оценка', value: 'resultValue',},
        {title: 'Дата проведения', value: 'date'},
        {title: '', value: 'action'},
    ];

    const editAudit = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.stopPropagation();
        navigate(`/audit/${id}/edit`);
    }

    const deleteAudit = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.stopPropagation();
        const formData = new FormData();
        formData.set("audit", JSON.stringify({id}));
        await fetcher.submit(formData, {method: 'DELETE'});
    }

    const getCellValue = (row: Audit, key: string) => {
        if (key === 'action') {
            return (
                <Stack direction="row" justifyContent="flex-end" gap={3}>
                    <Tooltip title="Редактировать аудит" placement="top">
                        <IconButton onClick={e => editAudit(e, row.id)}>
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить аудит" placement="top">
                        <IconButton onClick={e => deleteAudit(e, row.id)}> <DeleteIcon/> </IconButton>
                    </Tooltip>
                </Stack>
            );
        }
        if (key === 'date') {
            return format((row.date || row.createdAt), 'dd.MM.yyyy');
        }
        const value = row[key as keyof Audit]
        return value ? value.toString() : '';
    }

    return (
        <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} mb={4}>
                <Typography
                    variant="h5"
                    component="h3"
                    flex={1}
                >
                    {auditedObject?.name}
                </Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/audit/${auditedObject.id}/create`)}
                >
                    Пройти аудит
                </Button>
            </Stack>

            {auditedObject.audits.length > 0 ?
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="objects table">
                        <TableHead>
                            <TableRow>
                                {columns.map(({title, value}) => (
                                    <TableCell key={value} sx={{fontWeight: 'bold', fontSize: '1rem'}}>{title}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {auditedObject.audits.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}, cursor: 'pointer'}}
                                    onClick={() => navigate(`/audit/${row.id}`)}
                                >
                                    {columns.map(({value}) => (
                                        <TableCell key={value}>
                                            {getCellValue(row, value)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                : <Typography variant="body1" color="textSecondary">Нет аудитов</Typography>
            }
        </>
    )
}
