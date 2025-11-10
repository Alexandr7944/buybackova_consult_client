import React from "react";
import {useFetcher, useLoaderData} from "react-router-dom";
import {MaturityLevelInput} from "@/components/maturityLevel/MaturityLevelInput";
import type {Section, Report} from "./shared/types";
import type {Audit} from "@/pages/audits/shared/types.ts";
import {BreadcrumbsRow} from "@/components/BreadcrumbsRow.tsx";

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
        <>
            <BreadcrumbsRow
                name="Редактирование аудита"
                links={[{href: `/object/${audit.objectId}`, name: 'Аудиты'}]}
            />

            <MaturityLevelInput
                sections={sections}
                audit={audit}
                submitForm={submitForm}
            />
        </>
    )
};
