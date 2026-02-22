import {Stack} from "@mui/material";

export const MultilineTextRenderer = ({value}: { value: string }) => (
    <Stack>
        {value.split('\n').map((line: string, i: number) => (
            <p key={`${line}-${i}`} style={{margin: 0}}>{line}</p>
        ))}
    </Stack>
);
