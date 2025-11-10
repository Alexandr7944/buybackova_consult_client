import {AuditList} from "@/pages/audits/AuditList.tsx";
import type {LoaderFunctionArgs} from "react-router-dom";
import {fetchObject, removeAudit} from "@/pages/audits/shared/audits.api.ts";

export const Component = AuditList;

export async function loader({params, request}: LoaderFunctionArgs) {
    const id = params?.id && +params.id;
    if (!id)
        throw new Error("Invalid ID");

    return fetchObject(id, request.signal)
}

export async function action({request}: LoaderFunctionArgs) {
    const formData = await request.formData();
    const state = formData.get("audit");

    if (typeof state !== "string" || state.length === 0) {
        return new Response(JSON.stringify({message: "Некорректные данные формы"}), {
            status:  400,
            headers: {"Content-Type": "application/json"},
        });
    }

    if (state)
        return removeAudit(state, request.signal);
}
