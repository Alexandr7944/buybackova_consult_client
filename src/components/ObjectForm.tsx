import {Button, InputLabel, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert} from "@mui/material";
import React from "react";
import type {AuditableObject} from "@/pages/audits/shared/types.ts";

type EditObjectProps = {
    companies: Array<{ id: number, name: string }>,
    form: Partial<AuditableObject>,
    title?: string,
    message?: string,
    loading: boolean,
    setForm: (object: Partial<AuditableObject>) => void;
    handleClose: () => void,
    handleSubmit: () => void,
};

export const ObjectForm: React.FC<EditObjectProps> = ({handleClose, handleSubmit, form, setForm, title, companies, message, loading}) => {
    const handleChange = (data: Record<string, string | number | null>) => {
        setForm(({...form, ...data}));
    };

    const changeSelect = (value: number) => {
        handleChange({companyId: value || null});
    }

    const columns = [{title: 'Название', value: 'name'}, {title: 'Адрес', value: 'address'},]

    return (
        <Dialog open={true} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{title ?? 'Редактирование объекта'}</DialogTitle>
            <DialogContent dividers>
                {message && <Alert severity="error">{message}</Alert>}
                {
                    columns.map(({title, value}) => (
                        <TextField
                            key={value}
                            margin="normal"
                            fullWidth
                            label={title}
                            value={form[value as keyof AuditableObject] ?? ''}
                            onChange={e => handleChange({[value as keyof AuditableObject]: e.target.value})}
                        />
                    ))
                }
                {
                    companies.length > 0 && (
                        <>
                            <InputLabel id="select-label" sx={{fontSize: '14px', marginLeft: '12px'}}>Компания</InputLabel>
                            <Select
                                labelId="select-label"
                                label="Компания"
                                value={form.companyId || ''}
                                onChange={(e) => changeSelect(+e.target.value)}
                                fullWidth
                            >
                                {
                                    companies.map(({id, name}) => (
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
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
