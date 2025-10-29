import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import type {AuditableObject} from "@/pages/auditable-objects/shared/types.ts";
import React from "react";

type EditObjectProps = {
    form: Partial<AuditableObject>,
    columns: Array<{ title: string, value: string }>,
    title?: string,
    handleChange: (key: keyof AuditableObject) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleClose: () => void,
    handleSubmit: () => void,
};

export const EditObject: React.FC<EditObjectProps> = ({handleClose, handleSubmit, columns, form, handleChange, title}) => {
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
                            onChange={handleChange(value as keyof AuditableObject)}
                        />
                    ))
                }
            </DialogContent>
            <DialogActions sx={{padding: 3}}>
                <Button onClick={handleClose}>Отмена</Button>
                <Button onClick={handleSubmit} variant="contained">Сохранить</Button>
            </DialogActions>
        </Dialog>
    )
}
