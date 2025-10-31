import React from "react";
import {useLoaderData, useNavigate, useParams} from "react-router-dom";
import {Box, Container, Typography} from "@mui/material";
import {MaturityLevelInput} from "@/components/maturityLevel/MaturityLevelInput";
import type {Section} from "./shared/types";
import type {Audit} from "@/pages/audits/shared/types.ts";
import {BreadcrumbsRow} from "@/components/BreadcrumbsRow.tsx";
import {createAudit} from "@/pages/audits/shared/audits.api.ts";

export const NewAudit: React.FC = () => {
    const sections = useLoaderData() as Section[];
    const navigate = useNavigate();
    const {objectId} = useParams();

    if (!objectId)
        return <div>No objectId provided</div>;

    const audit = {
        objectId:  +objectId,
        formState: {},
        createdAt: new Date(),
    };

    async function submitForm(state: Audit) {
        if (!state) return;

        const newAudit = {...audit, ...state,};
        const response = await createAudit(JSON.stringify(newAudit));

        if (response.id)
            navigate(`/audit/${response.id}/edit`)
    }

    return (
        <>
            <BreadcrumbsRow
                name="Новый аудит"
                links={[{href: `/object/${audit.objectId}`, name: 'Аудиты'}]}
            />
            <Container maxWidth="lg" sx={{py: 4}}>
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
