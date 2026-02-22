import {SelectRenderer} from "@/components/recotigorizeComponents/SelectRenderer.tsx";
import type {GridRenderEditCellParams} from "@mui/x-data-grid";
import type {ParamsRow} from "@/pages/admin/recategorize/shared/types.ts";

export const SelectEditCell = (props: GridRenderEditCellParams, options: ParamsRow[]) => {
    const { id, field, value, api } = props;

    const handleChange = (newValue: number | null) => {
        api.setEditCellValue({ id, field, value: newValue });
        api.stopCellEditMode({ id, field });
    };

    return (
        <SelectRenderer
            value={value}
            options={options}
            onChange={handleChange}
        />
    );
};
