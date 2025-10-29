import React from "react";
import {useFetcher, useLoaderData} from "react-router-dom";
import {Box, Container, Paper, Stack, Typography} from "@mui/material";
import {MaturityLevelInput} from "@/components/maturityLevel/MaturityLevelInput";
import type {Section, Report} from "./shared/types";
import type {Audit} from "@/pages/audits/shared/types.ts";

export const AuditEdit: React.FC = () => {
    const [sections, audit] = useLoaderData<[Section[], Audit]>();
    const fetcher = useFetcher<Report>();

    async function submitForm(state: Audit) {
        if (!state) return;

        const formData = new FormData();
        formData.set("editState", JSON.stringify(state));

        await fetcher.submit(formData, {method: "PATCH"});
    }

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            {/*<pre>{JSON.stringify(sections, null, 2)}</pre>*/}
            {/*<pre>{JSON.stringify(audit, null, 2)}</pre>*/}
            <Paper elevation={0} sx={{mb: 3, backgroundColor: 'transparent'}}>
                <Stack
                    direction={{xs: 'column', sm: 'row'}}
                    spacing={2}
                    alignItems={{xs: 'flex-start', sm: 'flex-end'}}
                    justifyContent="space-between"
                >
                    <Typography variant="h5" component="h1">
                        Уровень клиентского опыта
                    </Typography>
                </Stack>
            </Paper>

            <Box>
                <MaturityLevelInput
                    sections={sections}
                    audit={audit}
                    submitForm={submitForm}
                />
            </Box>
        </Container>
    )
};
