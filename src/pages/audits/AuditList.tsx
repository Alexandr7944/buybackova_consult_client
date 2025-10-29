import {useLoaderData, useNavigate} from "react-router-dom";
import {
    Button,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import type {AuditableObject} from "@/pages/audits/shared/types.ts";
import type {Audit} from "@/pages/audits/shared/types.ts";
import {format} from "date-fns";
import EditIcon from '@mui/icons-material/edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import DeleteIcon from "@mui/icons-material/Delete";

export const AuditList = () => {
    const auditedObject = useLoaderData<AuditableObject>();
    const navigate = useNavigate();

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

    const getCellValue = (row: Audit, key: string) => {
        if (key === 'action') {
            return (
                <Stack direction="row" justifyContent="end" alignItems="center" gap={2}>
                    <IconButton onClick={e => e.stopPropagation()}> <ContentCopyIcon/> </IconButton>
                    <IconButton onClick={e => editAudit(e, row.id)}> <EditIcon/> </IconButton>
                    {/*<IconButton onClick={e => e.stopPropagation()}> <DeleteIcon/> </IconButton>*/}
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
                    Провести аудит
                </Button>
            </Stack>

            {auditedObject.audits.length > 0 ?
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="objects table">
                        <TableHead>
                            <TableRow>
                                {columns.map(({title, value}) => (
                                    <TableCell key={value}>{title}</TableCell>
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
