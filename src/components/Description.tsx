import {DescriptionForm} from "@/components/DescriptionForm.tsx";
import {Button, Stack, Box} from "@mui/material";
import {type FC, useState} from "react";

type DescriptionProps = {
    name: string;
    value: string | null;
    saveChange: (data: { [key: string]: string | null }) => Promise<void>;
}

export const Description: FC<DescriptionProps> = ({name, value, saveChange}) => {
    const [isEdit, setEdit] = useState<boolean>(false);
    const submit = async (data: { [key: string]: string | null }) => {
        setEdit(false);
        await saveChange(data);
    }

    const getButtonValue = () => {
        if (value)
            return 'Редактировать';

        return name === 'reportDescription'
            ? 'Добавить описание отчета'
            : 'Добавить описание к графику';
    }

    return (
        <Box sx={{marginTop: 4, marginBottom: 4}}
             className="px-4">
            {
                isEdit
                    ? <DescriptionForm
                        name={name}
                        startValue={value}
                        saveChange={submit}
                        onClose={() => setEdit(false)}
                    />
                    : <Stack spacing={3} alignItems="flex-start">
                        <Box>
                            {value && value.split('\n').map((item, index) => (
                                <p key={index}>{item}</p>
                            ))}
                        </Box>
                        <Button
                            className="no-print"
                            variant="outlined"
                            color="primary"
                            onClick={() => setEdit(true)}
                        >
                            {getButtonValue()}
                        </Button>
                    </Stack>
            }
        </Box>
    )
}
