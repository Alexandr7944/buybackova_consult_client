import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Stack,
    Typography,
    Paper,
    IconButton
} from "@mui/material";
import EditIcon from '@mui/icons-material/edit';
import React from "react";
import type {AuditableObject} from "@/pages/auditable-objects/shared/types.ts";
import {useFetcher, useLoaderData, useNavigate} from "react-router-dom";
import {EditObject} from "@/components/EditObject.tsx";

export const AuditableObjects: React.FC = () => {
    const objects = useLoaderData() as AuditableObject[];
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

    const handleChange = (field: keyof AuditableObject) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({...prev, [field]: e.target.value}));
    };

    const createObject = async () => {
        const formData = new FormData();
        formData.set("state", JSON.stringify(form));
        await fetcher.submit(formData, {method: "post"});

        handleClose();
    };

    const columns = [
        {title: 'Название', value: 'name'},
        {title: 'Адрес', value: 'address'},
        {title: '', value: 'action'},
    ];

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
                                        <TableCell key={value}>{title}</TableCell>
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
                                        {columns.map(({value}) => (
                                            <TableCell key={value}>
                                                {
                                                    value === 'action'
                                                        ? <Stack direction="row" justifyContent="end" alignItems="center" gap={2}>
                                                            <IconButton aria-label="edit" onClick={(e) => handleEditForm(e, row)}>
                                                                <EditIcon/>
                                                            </IconButton>
                                                        </Stack>
                                                        : row[value as keyof AuditableObject].toString()
                                                }
                                            </TableCell>
                                        ))}
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
                    columns={columns.filter(({value}) => value !== 'action')}
                    form={form}
                    handleChange={handleChange}
                />
            }

            {openEditForm &&
                <EditObject
                    handleClose={handleClose}
                    handleSubmit={editObject}
                    columns={columns.filter(({value}) => value !== 'action')}
                    form={form}
                    handleChange={handleChange}
                />
            }
        </>
    );
}
