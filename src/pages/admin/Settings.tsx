import type {Company} from "@/pages/admin/shared/types.ts";
import {useFetcher, useLoaderData} from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/edit";
import React, {useMemo} from "react";

export const Settings = () => {
    const [companies, users] = useLoaderData<[Company[], { id: number, name: string }[]]>();
    const fetcher = useFetcher();

    const [form, setForm] = React.useState<Partial<Company>>({});
    const [openForm, setOpenForm] = React.useState(false);
    const [message, setMessage] = React.useState('');

    const setAlert = (message: string) => {
        setMessage(message);
        setTimeout(() => setMessage(''), 3000);
    }

    const handleClose = () => {
        setOpenForm(false);
        setForm({});
    };

    const handleEditForm = async (e: React.MouseEvent<HTMLButtonElement>, company: Company) => {
        e.stopPropagation();
        setForm(company);
        setOpenForm(true);
    }

    const usersById = useMemo(() => {
        return users.reduce((acc: Record<string, string>, user) => {
            acc[user.id] = user.name;
            return acc;
        }, {});
    }, [users])

    const handleChange = (ids: string | number[]) => {
        if (Array.isArray(ids))
            setForm({
                ...form,
                users: ids.map(id => ({id: id, name: usersById[id]}))
            })
    }

    const handleSubmit = async () => {
        if (!form.name)
            return setAlert('Название компании не может быть пустым');
        if (!form.ownerId)
            return setAlert('Выберете владельца компании');

        const formData = new FormData();
        const data = {
            name:    form.name,
            ownerId: form.ownerId,
            users:   form.users?.map(({id}) => id)
        };

        if (form.id) {
            formData.set("updateForm", JSON.stringify({...data, id: form.id}))
            await fetcher.submit(formData, {method: "patch"});
        } else {
            formData.set("createForm", JSON.stringify(data))
            await fetcher.submit(formData, {method: "post"});
        }

        handleClose();
    }

    const getCellValue = (row: Company, column: keyof Company) => {
        if (column === 'owner')
            return row[column]?.name || 'Владельца не определен';
        if (column === 'users')
            return row.users
                .filter(({id}) => id !== row.ownerId)
                .map(({name}) => name)
                .join(', ') || 'Нет сотрудников'; //'Нет сотрудников'

        return row[column] ? row[column].toString() : '';
    }

    const columns: { title: string, value: keyof Company }[] = [
        {title: 'id', value: 'id'},
        {title: 'Название', value: 'name'},
        {title: 'Владелец', value: 'owner'},
        {title: 'Сотрудники', value: 'users'},
    ]

    return (
        <div>
            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} mb={4}>
                <Typography variant="h5" component="h3">
                    Настроить компании
                </Typography>
                <Button variant="outlined" color="primary" onClick={() => setOpenForm(true)}>
                    Добавить компанию
                </Button>
            </Stack>

            {companies.length > 0 ?
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="objects table">
                        <TableHead>
                            <TableRow>
                                {columns.map(({title, value}) => (
                                    <TableCell key={value} sx={{fontWeight: 'bold', fontSize: '1rem'}}>
                                        {title}
                                    </TableCell>
                                ))}
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {companies.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    {columns.map(({value}) => (
                                        <TableCell key={value}>
                                            {getCellValue(row, value)}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <Tooltip title="Редактировать объект" placement="top">
                                            <IconButton aria-label="edit" onClick={(e) => handleEditForm(e, row)}>
                                                <EditIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                : <Typography variant="body1" color="textSecondary">Нет компаний</Typography>
            }

            {openForm &&
                <Dialog open={true} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>{form?.id ? 'Редактирование компании' : 'Создание компании'}</DialogTitle>
                    <DialogContent dividers>
                        {message && <Alert severity="error">{message}</Alert>}
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Название компании"
                            required
                            value={form.name || ''}
                            onChange={e => setForm({...form, name: e.target.value})}
                        />
                        {
                            users.length > 0 && (
                                <>
                                    <InputLabel id="select-label" sx={{fontSize: '14px', marginLeft: '12px'}}>Владелец</InputLabel>
                                    <Select
                                        labelId="select-label"
                                        label="Владелец"
                                        value={form.ownerId || ''}
                                        onChange={(e) => setForm({...form, ownerId: +e.target.value || null})}
                                        fullWidth
                                    >
                                        {
                                            users.map(({id, name}) => (
                                                <MenuItem key={id} value={id}>{name}</MenuItem>
                                            ))
                                        }
                                    </Select>

                                    <InputLabel id="select-label" sx={{fontSize: '14px', marginLeft: '12px', marginTop: '12px'}}>
                                        Сотрудники компании
                                    </InputLabel>
                                    <Select
                                        labelId="select-label"
                                        multiple
                                        value={(form.users || []).map(({id}) => id)}
                                        onChange={(e) => handleChange(e.target.value)}
                                        fullWidth
                                    >
                                        {
                                            users.map(({id, name}) => (
                                                <MenuItem key={id} value={id}>{name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </>
                            )
                        }
                    </DialogContent>
                    <DialogActions sx={{padding: 3}}>
                        <Button onClick={handleClose}>Отмена</Button>
                        <Button onClick={handleSubmit} variant="contained">Сохранить</Button>
                    </DialogActions>
                </Dialog>}
        </div>
    )
}
