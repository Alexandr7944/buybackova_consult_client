import type {ActionFunctionArgs, LoaderFunctionArgs} from "react-router-dom";
import {AuditableObjects} from "@/pages/audits/AuditableObjects.tsx";
import {fetchAuditableObjects, postNewAuditableObject, updateAuditableObject} from "@/pages/audits/shared/audits.api.ts";
import {fetchCompanies} from "@/pages/admin/shared/settings.api.ts";

export const Component = AuditableObjects;

export async function loader({request}: LoaderFunctionArgs) {
    return Promise.all([
        fetchAuditableObjects(request.signal),
        fetchCompanies(),
    ])
}

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const state = formData.get("state");
    const updateForm = formData.get("updateForm");

    if (state) {
        if (typeof state !== "string" || state.length === 0)
            return handleError()

        return postNewAuditableObject(state, request.signal);
    }

    if (updateForm) {
        if (typeof updateForm !== "string" || updateForm.length === 0)
            return handleError()

        return updateAuditableObject(updateForm, request.signal);
    }

}

function handleError() {
    return new Response(JSON.stringify({message: "Некорректные данные формы"}), {
        status:  400,
        headers: {"Content-Type": "application/json"},
    });
}
