import {Table, Tooltip, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Stack, Typography, Paper, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/edit';
import React, {useMemo} from "react";
import type {AuditableObject} from "@/pages/audits/shared/types.ts";
import {useFetcher, useLoaderData, useNavigate} from "react-router-dom";
import {EditObject} from "@/components/EditObject.tsx";

export const AuditableObjects: React.FC = () => {
    const [objects, users] = useLoaderData<[AuditableObject[], { id: number, name: string }[]]>();
    const fetcher = useFetcher<AuditableObject>();
    const navigate = useNavigate();

    const [openCreateForm, setOpenCreateForm] = React.useState(false);
    const [openEditForm, setOpenEditForm] = React.useState(false);
    const [form, setForm] = React.useState<Partial<AuditableObject>>({});

    const handleClose = () => {
        setOpenCreateForm(false);
        setOpenEditForm(false)
        setForm({});
    };

    const createObject = async () => {
        const formData = new FormData();
        formData.set("state", JSON.stringify(form));
        await fetcher.submit(formData, {method: "post"});

        handleClose();
    };

    const columns = useMemo(() => {
        const items = [
            {title: 'Название', value: 'name'},
            {title: 'Адрес', value: 'address'},
            {title: '', value: 'action'},
        ];

        if (users.length > 0)
            items.splice(2, 0, {title: 'Заказчик', value: 'ownerId'})

        return items;
    }, []);

    const handleEditForm = async (e: React.MouseEvent<HTMLButtonElement>, object: AuditableObject) => {
        e.stopPropagation();
        setForm(object);
        setOpenEditForm(true);
    }

    const editObject = async () => {
        const formData = new FormData();
        formData.set("updateForm", JSON.stringify(form));
        await fetcher.submit(formData, {method: "patch"});

        handleClose();
    };

    const getCellValue = (row: AuditableObject, column: string) => {
        if (column === 'action') {
            return (
                <Stack direction="row" justifyContent="end" alignItems="center" gap={2}>
                    <Button> Аудиты </Button>
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/audit/${row.id}/create`)
                    }}> Пройти аудит </Button>
                    <Tooltip title="Редактировать объект" placement="top">
                        <IconButton aria-label="edit" onClick={(e) => handleEditForm(e, row)}>
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                </Stack>
            )
        } else if (column === 'ownerId') {
            return users.find((user) => user.id === +row.ownerId)?.name || '';
        }

        return row[column as keyof AuditableObject].toString();
    }

    return (
        <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h5" component="h3">Объекты аудита</Typography>
                <Button variant="outlined" color="primary" onClick={() => setOpenCreateForm(true)}>
                    Добавить объект
                </Button>
            </Stack>

            {
                objects.length > 0
                    ? <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="objects table">
                            <TableHead>
                                <TableRow>
                                    {columns.map(({title, value}) => (
                                        <TableCell key={value} sx={{fontWeight: 'bold', fontSize: '1rem'}}>
                                            {title}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {objects.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}, cursor: 'pointer'}}
                                        onClick={() => navigate(`/object/${row.id}`)}
                                    >
                                        {
                                            columns.map(({value}) => (
                                                <TableCell key={value}>{getCellValue(row, value)}</TableCell>))
                                        }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    : <Typography variant="body1" component="p">Добавьте объекты аудита</Typography>
            }

            {openCreateForm &&
                <EditObject
                    title="Добавить объект"
                    handleClose={handleClose}
                    handleSubmit={createObject}
                    users={users}
                    form={form}
                    setForm={setForm}
                />
            }

            {openEditForm &&
                <EditObject
                    handleClose={handleClose}
                    handleSubmit={editObject}
                    users={users}
                    form={form}
                    setForm={setForm}
                />
            }
        </>
    );
}
