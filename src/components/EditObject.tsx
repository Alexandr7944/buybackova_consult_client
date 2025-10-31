import {Button, InputLabel, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React from "react";
import type {AuditableObject} from "@/pages/audits/shared/types.ts";

type EditObjectProps = {
    users: Array<{ id: number, name: string }>,
    form: Partial<AuditableObject>,
    title?: string,
    setForm: (object: Partial<AuditableObject>) => void;
    handleClose: () => void,
    handleSubmit: () => void,
};

export const EditObject: React.FC<EditObjectProps> = ({handleClose, handleSubmit, form, setForm, title, users,}) => {

    const handleChange = (data: Record<string, string | number | null>) => {
        setForm(({...form, ...data}));
    };

    const changeSelect = (value: number) => {
        handleChange({ownerId: value || null});
    }

    const columns = [{title: 'Название', value: 'name'}, {title: 'Адрес', value: 'address'},]

    return (
        <Dialog open={true} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{title ?? 'Редактирование объекта'}</DialogTitle>
            <DialogContent dividers>
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
                    users.length > 0 && (
                        <>
                            <InputLabel id="select-label" sx={{fontSize: '14px', marginLeft: '12px'}}>Заказчик</InputLabel>
                            <Select
                                labelId="select-label"
                                label="Заказчик"
                                value={form.ownerId || ''}
                                onChange={(e) => changeSelect(+e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="">Не выбран</MenuItem>
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
        </Dialog>
    )
}
