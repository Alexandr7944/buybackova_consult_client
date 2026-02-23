import {MenuItem, Select} from "@mui/material";
import type {ParamsRow} from "@/pages/admin/recategorize/shared/types.ts";

export const SelectRenderer = ({
                                   value,
                                   options,
                                   onChange,
                               }: {
    value?: string;
    options: ParamsRow[];
    onChange: (newValue: string | null) => void;
}) => {
    const DEFAULT_VALUE = '-';
    return (
        <Select
            value={value || DEFAULT_VALUE}
            onChange={(e) => {
                const newValue = e.target.value === DEFAULT_VALUE ? null : e.target.value;
                onChange(newValue);
            }}
            sx={{width: '100%'}}
            size="small"
        >
            <MenuItem value={DEFAULT_VALUE}>Не определен</MenuItem>
            {options.map(({id, title}) => (
                <MenuItem key={id} value={title}>{title}</MenuItem>
            ))}
        </Select>
    )
};
