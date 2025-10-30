import React from "react";
import {useFetcher, useLoaderData, useParams} from "react-router-dom";
import {Box, Container, Typography} from "@mui/material";
import {MaturityLevelInput} from "@/components/maturityLevel/MaturityLevelInput";
import type {Section, Report} from "./shared/types";
import type {Audit} from "@/pages/audits/shared/types.ts";
import {BreadcrumbsRow} from "@/components/BreadcrumbsRow.tsx";

export const NewAudit: React.FC = () => {
    const sections = useLoaderData() as Section[];
    const {objectId} = useParams();
    if (!objectId)
        return <div>No objectId provided</div>;

    const audit = {
        objectId:  +objectId,
        formState: {},
        createdAt: new Date(),
    };

    const fetcher = useFetcher<Report>();

    async function submitForm(state: Audit) {
        if (!state) return;

        const newAudit = {
            ...audit,
            ...state,
        }
        const formData = new FormData();
        formData.set("state", JSON.stringify(newAudit));

        await fetcher.submit(formData, {method: "post"});
    }

    return (
        <>
            <BreadcrumbsRow
                name="Новый аудит"
                links={[{href: `/object/${audit.objectId}`, name: 'Аудиты'}]}
            />
            <Container maxWidth="lg" sx={{py: 4}}>
                {/*<pre>{JSON.stringify(audit, null, 2)}</pre>*/}
                <Typography variant="h5" component="h1">
                    Уровень клиентского опыта
                </Typography>

                <Box>
                    <MaturityLevelInput
                        sections={sections}
                        audit={audit as Audit}
                        submitForm={submitForm}
                    />
                </Box>
            </Container>
        </>
    )
};
