import {useFetcher, useLoaderData} from "react-router-dom";
import type {BundleParams} from "@/pages/admin/recategorize/shared/types.ts";
import {Paper,} from "@mui/material";
import {
    DataGrid,
    type GridRenderCellParams,
    type GridRenderEditCellParams,
    type GridRowModel
} from '@mui/x-data-grid';
import {useCallback} from "react";
import {MultilineTextEditor} from "@/components/recotigorizeComponents/MultilineTextEditor.tsx";
import {MultilineTextRenderer} from "@/components/recotigorizeComponents/MultilineTextRenderer.tsx";
import {SelectRenderer} from "@/components/recotigorizeComponents/SelectRenderer.tsx";
import {SelectEditCell} from "@/components/recotigorizeComponents/SelectEditCell.tsx";

export const CategoryReassignPanel = () => {
    const data = useLoaderData<BundleParams>();
    const fetcher = useFetcher();

    const processRowUpdate = useCallback(async (newRow: GridRowModel, oldRow: GridRowModel) => {
        if (JSON.stringify(newRow) === JSON.stringify(oldRow)) {
            return oldRow;
        }

        const formData = new FormData();
        formData.set("editQuestion", JSON.stringify(newRow));
        await fetcher.submit(formData, {method: "PATCH"});

        return newRow;
    }, [fetcher]);

    const columns = [
        {
            field:      'id',
            headerName: 'ID',
            width:      70
        },
        {
            field:          'standard',
            headerName:     'Стандарт',
            width:          300,
            editable:       true,
            renderCell:     (params: GridRenderCellParams) => (
                <MultilineTextRenderer value={params.value || ''}/>
            ),
            renderEditCell: (params: GridRenderEditCellParams) => (
                <MultilineTextEditor {...params} />
            ),
        },
        {
            field:          'question',
            headerName:     'Вопросы',
            width:          300,
            editable:       true,
            renderCell:     (params: GridRenderCellParams) => (
                <MultilineTextRenderer value={params.value || ''}/>
            ),
            renderEditCell: (params: GridRenderEditCellParams) => (
                <MultilineTextEditor {...params} />
            ),
        },
        {
            field:          'sectionId',
            headerName:     'Секции',
            width:          200,
            renderCell:     (params: GridRenderCellParams) => (
                <SelectRenderer
                    value={params.value}
                    options={data.sections}
                    onChange={async (newValue) => {
                        const updatedQuestion = {...params.row, sectionId: newValue};
                        const formData = new FormData();
                        formData.set("editQuestion", JSON.stringify(updatedQuestion));
                        await fetcher.submit(formData, {method: "PATCH"});
                    }}
                />
            ),
            renderEditCell: (params: GridRenderEditCellParams) =>
                                SelectEditCell(params, data.sections),
        },
        {
            field:          'categoryId',
            headerName:     'Категории',
            width:          200,
            renderCell:     (params: GridRenderCellParams) => (
                <SelectRenderer
                    value={params.value}
                    options={data.categories}
                    onChange={async (newValue) => {
                        const updatedQuestion = {...params.row, categoryId: newValue};
                        const formData = new FormData();
                        formData.set("editQuestion", JSON.stringify(updatedQuestion));
                        await fetcher.submit(formData, {method: "PATCH"});
                    }}
                />
            ),
            renderEditCell: (params: GridRenderEditCellParams) =>
                                SelectEditCell(params, data.categories),
        },
        {
            field:          'toolId',
            headerName:     'Инструменты',
            width:          200,
            renderCell:     (params: GridRenderCellParams) => (
                <SelectRenderer
                    value={params.value}
                    options={data.tools}
                    onChange={async (newValue) => {
                        const updatedQuestion = {...params.row, toolId: newValue};
                        const formData = new FormData();
                        formData.set("editQuestion", JSON.stringify(updatedQuestion));
                        await fetcher.submit(formData, {method: "PATCH"});
                    }}
                />
            ),
            renderEditCell: (params: GridRenderEditCellParams) =>
                                SelectEditCell(params, data.tools),
        },
    ];

    return (
        <Paper>
            <DataGrid
                rows={data.questions}
                columns={columns}
                sx={{
                    border:                             0,
                    '& .MuiDataGrid-cell':              {whiteSpace: 'normal', wordWrap: 'break-word',},
                    '& .MuiDataGrid-cell:focus-within': {outline: 'none',},
                }}
                initialState={{
                    pagination: {paginationModel: {pageSize: 10, page: 0},},
                    sorting:    {sortModel: [{field: 'id', sort: 'asc'}],},
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                processRowUpdate={processRowUpdate}
                filterMode="client"
                sortingMode="client"
                paginationMode="client"
                getRowHeight={() => 'auto'}
                getEstimatedRowHeight={() => 100}
                onCellKeyDown={(_params, event) => {
                    if (event.key === 'Enter')
                        event.stopPropagation();
                }}
            />
        </Paper>
    )
}
