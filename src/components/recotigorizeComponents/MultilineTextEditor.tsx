import {type GridRenderEditCellParams} from "@mui/x-data-grid";
import {type FC} from "react";

export const MultilineTextEditor: FC<GridRenderEditCellParams> = ({id, field, value, api}) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        event.stopPropagation();

        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            api.stopCellEditMode({id, field});
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        api.setEditCellValue({id, field, value: event.target.value});
    };

    return (
        <textarea
            value={value || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
                width:           '100%',
                height:          '100%',
                border:          'none',
                outline:         'none',
                padding:         '8px',
                fontFamily:      'inherit',
                fontSize:        'inherit',
                resize:          'none',
                backgroundColor: 'transparent',
            }}
        />
    );
};
