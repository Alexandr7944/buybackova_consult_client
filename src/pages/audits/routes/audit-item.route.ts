import type {ActionFunctionArgs, LoaderFunctionArgs} from "react-router-dom";
import {AuditItem} from "@/pages/audits/AuditItem.tsx";
import {fetchAuditItem, updateAudit} from "@/pages/audits/shared/audits.api.ts";

export const Component = AuditItem;

export async function loader({params}: LoaderFunctionArgs) {
    const id = params?.id && +params.id;
    if (!id)
        throw new Error("Invalid ID");

    return fetchAuditItem(id);
}

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const state = formData.get("editState");

    if (typeof state !== "string" || state.length === 0) {
        return new Response(JSON.stringify({message: "Некорректные данные формы"}), {
            status:  400,
            headers: {"Content-Type": "application/json"},
        });
    }

    return updateAudit(state, request.signal);
}
