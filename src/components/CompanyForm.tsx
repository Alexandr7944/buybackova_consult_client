import React from 'react';
import {useFetcher} from 'react-router-dom';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, InputLabel, Select, MenuItem, Alert
} from '@mui/material';
import type {Company} from "@/pages/admin/shared/types.ts";

interface CompanyFormProps {
    onClose: () => void;
    company?: Company;
    users: { id: number; name: string; companyId: number | null }[];
}

export const CompanyForm: React.FC<CompanyFormProps> = ({onClose, company, users}) => {
    const fetcher = useFetcher();
    const [form, setForm] = React.useState<Partial<Company & { usersIds: number[] }>>(
        company
            ? {
                ...company,
                usersIds: company.users.map(u => u.id)
            }
            : {}
    );

    const [status, setStatus] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);

    const isEditing = !!company?.id;

    const handleSubmit = async () => {
        if (!form.name) return setStatus({type: 'error', message: 'Название не может быть пустым'});
        if (!form.ownerId) return setStatus({type: 'error', message: 'Выберите владельца'});

        const formData = new FormData();
        const data = {name: form.name, ownerId: form.ownerId, users: form.usersIds};

        formData.set(isEditing ? "updateForm" : "createForm", JSON.stringify({...data, id: company?.id}));
        await fetcher.submit(formData, {method: isEditing ? "patch" : "post"});

        setStatus({type: 'success', message: 'Данные успешно сохранены'});
        setTimeout(() => {
            setStatus(null);
            onClose();
        }, 1000);
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditing ? 'Редактирование компании' : 'Создание компании'}</DialogTitle>
            <DialogContent dividers>
                {status && <Alert
                    severity={status.type}
                    className="mb-4"
                    onClose={() => setStatus(null)}
                >
                    {status.message}
                </Alert>}
                <TextField
                    fullWidth
                    label="Название компании"
                    value={form.name || ''}
                    onChange={e => setForm({...form, name: e.target.value})}
                />

                <InputLabel id="owner-label" sx={{fontSize: '14px', marginLeft: '12px', marginTop: '12px'}}>Владелец</InputLabel>
                <Select
                    labelId="owner-label"
                    value={form.ownerId || ''}
                    onChange={e => setForm({...form, ownerId: +e.target.value})}
                    fullWidth
                >
                    {users.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
                </Select>

                <InputLabel id="users-label" sx={{fontSize: '14px', marginLeft: '12px', marginTop: '12px'}}>Сотрудники</InputLabel>
                <Select
                    labelId="users-label"
                    multiple
                    value={form.usersIds || []}
                    onChange={e => setForm({...form, usersIds: e.target.value as number[]})}
                    fullWidth
                >
                    {users.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={fetcher.state === 'loading'}>
                    {fetcher.state === 'loading' ? 'Сохранение...' : 'Сохранить'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
