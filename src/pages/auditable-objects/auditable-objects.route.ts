import {AuditableObjects} from "@/pages/auditable-objects/index.tsx";
import type {ActionFunctionArgs, LoaderFunctionArgs} from "react-router-dom";
import {fetchAuditableObjects, postNewAuditableObject, updateAuditableObject} from "@/pages/auditable-objects/shared/auditable-objects.api.ts";

export const Component = AuditableObjects;

export async function loader({request}: LoaderFunctionArgs) {
    return fetchAuditableObjects(request.signal)
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
