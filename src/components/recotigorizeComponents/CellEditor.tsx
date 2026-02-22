import {Button, Stack, TableCell, TextareaAutosize} from "@mui/material";

type CellEditorProps = {
    isEdit: boolean;
    value: string;
    editValue?: string;
    onChange: (val: string) => void;
    selectItem: () => void;
    resetCell: () => void
    saveCell: () => Promise<void>
}

export const CellEditor: React.FC<CellEditorProps> = ({isEdit, value, editValue, onChange, resetCell, saveCell, selectItem}) => {
    return (
        <TableCell>
            {
                isEdit
                    ? <Stack>
                        <TextareaAutosize
                            value={editValue}
                            onChange={e => onChange(e.target.value)}
                            style={{width: '100%'}}
                        />
                        <Stack direction='row' justifyContent='flex-end'>
                            <Button onClick={resetCell}>Отменить</Button>
                            <Button onClick={saveCell}>Сохранить</Button>
                        </Stack>
                    </Stack>
                    : <Stack onClick={selectItem}>
                        {value
                            .split('\n')
                            .map((item: string, i: number) => (<p key={item + i}>{item}</p>))
                        }
                    </Stack>
            }
        </TableCell>
    )
}
