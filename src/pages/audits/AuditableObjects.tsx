import {Table, Tooltip, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Stack, Typography, Paper, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/edit';
import React, {useMemo} from "react";
import type {AuditableObject} from "@/pages/audits/shared/types.ts";
import {useFetcher, useLoaderData, useNavigate} from "react-router-dom";
import {ObjectForm} from "@/components/ObjectForm.tsx";
import {RenderIf} from "@/components/RenderIf.tsx";
import {SearchAndSort} from "@/components/ui/SearchAndSort.tsx";
import {useAppSelector} from "@/hooks/hook.ts";

type FormType = {
    mode: 'create' | 'edit' | null;
    data: Partial<AuditableObject> | null;
}

export const AuditableObjects: React.FC = () => {
    const [objects, companies] = useLoaderData<[AuditableObject[], { id: number, name: string }[]]>();
    const fetcher = useFetcher<AuditableObject>();
    const {isAdmin} = useAppSelector(state => state.useAuthStore)
    const navigate = useNavigate();

    const [formState, setFormState] = React.useState<FormType>({mode: null, data: null});

    const [message, setMessage] = React.useState('');
    const setAlert = (message: string) => {
        setMessage(message);
        setTimeout(() => setMessage(''), 3000);
    }

    const [searchValue, setSearchValue] = React.useState('');
    const [sortValue, setSortValue] = React.useState<{ field: string, direction: 'asc' | 'desc' }>({field: '', direction: 'asc'});
    const sortOptions = [
        {field: 'name', label: 'По названию'},
        {field: 'auditCount', label: 'По количеству аудитов'},
    ];

    const processedObjects = useMemo(() => {
        const search = searchValue.toLowerCase();
        let filtered = search
            ? objects.filter(object => object.name.toLowerCase().includes(search))
            : objects;

        if (sortValue.field) {
            filtered.sort((a, b) => {
                if (sortValue.field === 'name') {
                    let aVal = a.name.toLowerCase();
                    let bVal = b.name.toLowerCase();
                    return sortValue.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                } else if (sortValue.field === 'auditCount') {
                    return sortValue.direction === 'asc'
                        ? a.auditCount - b.auditCount
                        : b.auditCount - a.auditCount;
                }

                return 0;
            });
        }

        return filtered;
    }, [objects, searchValue, sortValue]);

    const handleOpenForm = (mode: 'create' | 'edit', data: Partial<AuditableObject> = {}) => {
        setFormState({mode, data});
    };

    const handleSubmit = async () => {
        const {mode, data} = formState;
        if (!data) return;

        if (!data.name || !data.address) return setAlert("Заполните все поля");
        if (companies.length > 0 && !data.companyId) return setAlert("Выберите компанию");

        const formData = new FormData();
        formData.set(mode === 'create' ? "createForm" : "updateForm", JSON.stringify(data));

        await fetcher.submit(formData, {method: mode === 'create' ? "post" : "patch"});

        handleClose();
    };

    const handleClose = () => {
        setFormState({mode: null, data: null});
        setMessage('');
    };

    const columns = useMemo(() => {
        const items = [
            {title: 'Название', value: 'name'},
            {title: 'Адрес', value: 'address'},
            {title: 'Аудиты', value: 'auditCount'},
            {title: '', value: 'action'},
        ];

        if (companies.length > 0)
            items.splice(2, 0, {title: 'Компания', value: 'companyId'})

        return items;
    }, []);

    const ActionCell = React.memo(({row}: { row: AuditableObject }) => {
        const navigate = useNavigate();
        const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            handleOpenForm('edit', row);
        };

        return (
            <Stack direction="row" justifyContent="end" alignItems="center" gap={2}>
                <Button> Аудиты </Button>
                {isAdmin && <Button
                    onClick={() => navigate(`/audit/${row.id}/create`)}
                    className="text-nowrap"
                >
                    Пройти аудит
                </Button>}
                <Tooltip title="Редактировать объект" placement="top">
                    <IconButton aria-label="edit" onClick={handleEdit}>
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
            </Stack>
        );
    });

    const getCellValue = (row: AuditableObject, column: string) => {
        if (column === 'action')
            return <ActionCell row={row}/>;

        if (column === 'companyId')
            return companies.find((company) => company.id === +row.companyId)?.name || '';

        return row[column as keyof AuditableObject]?.toString();
    }

    return (
        <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h5" component="h3">Объекты аудита</Typography>
                {isAdmin && <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenForm('create')}
                >
                    Добавить объект
                </Button>}
            </Stack>

            <SearchAndSort
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                sortValue={sortValue}
                onSortChange={setSortValue}
                sortOptions={sortOptions}
                placeholder="Поиск по названию объекта"
                onEscapeKeyDown={() => setSearchValue('')}
            />

            <RenderIf
                condition={processedObjects.length > 0}
                fallbackMessage="Добавьте объекты аудита"
            >
                <TableContainer component={Paper}>
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
                            {processedObjects.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}, cursor: 'pointer'}}
                                    onClick={() => navigate(`/object/${row.id}`)}
                                >
                                    {columns.map(({value}) => (
                                        <TableCell key={value}>{getCellValue(row, value)}</TableCell>)
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </RenderIf>

            <RenderIf condition={formState.mode !== null}>
                <ObjectForm
                    title={formState.mode === 'create' ? 'Добавить объект' : 'Редактировать объект'}
                    handleClose={handleClose}
                    handleSubmit={handleSubmit}
                    companies={formState.mode === 'create' ? companies : []}
                    form={formState.data || {}}
                    setForm={(data) => setFormState(prev => ({...prev, data}))}
                    message={message}
                    loading={fetcher.state === 'loading'}
                />
            </RenderIf>
        </>
    );
}
