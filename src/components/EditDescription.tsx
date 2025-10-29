import {TextareaAutosize} from "@mui/material";
import {type FC, useState} from "react";

type EditDescriptionProps = {
    name: string;
    startValue: string | null;
    saveChange: (data: { [key: string]: string | null }) => Promise<void>
    onClose: () => void;
}

export const EditDescription: FC<EditDescriptionProps> = ({name, startValue, saveChange, onClose}) => {
    const [value, setValue] = useState<string | null>(startValue);

    const submit = async () => {
        if (value !== startValue)
            await saveChange({[name]: value});
        else
            onClose();
    }

    return (
        <TextareaAutosize
            minRows={3}
            placeholder="Добавьте описание"
            aria-label="audit description"
            style={{
                width:        '100%',
                outline:      '#222 solid 1px',
                borderRadius: '5px',
                padding:      '10px',
                margin:       '10px 0',
            }}
            value={value || ''}
            onChange={(event) => setValue(event.target.value)}
            onBlur={submit}
            onKeyDown={async (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    await submit();
                }
            }}
        />
    )
}
