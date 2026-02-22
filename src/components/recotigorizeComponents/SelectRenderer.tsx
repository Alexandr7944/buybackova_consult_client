import {MenuItem, Select} from "@mui/material";
import type {ParamsRow} from "@/pages/admin/recategorize/shared/types.ts";

export const SelectRenderer = ({
                                   value,
                                   options,
                                   onChange,
                                   allowEmpty = true
                               }: {
    value: number | null;
    options: ParamsRow[];
    onChange: (newValue: number | null) => void;
    allowEmpty?: boolean;
}) => (
    <Select
        value={value || 0}
        onChange={(e) => {
            const newValue = e.target.value === 0 ? null : e.target.value as number;
            onChange(newValue);
        }}
        sx={{width: '100%'}}
        size="small"
    >
        {allowEmpty && <MenuItem value={0}>Не определен</MenuItem>}
        {options.map(({id, title}) => (
            <MenuItem key={id} value={id}>{title}</MenuItem>
        ))}
    </Select>
);
