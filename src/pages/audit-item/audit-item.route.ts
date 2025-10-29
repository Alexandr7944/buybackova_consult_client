import {AuditItem} from "@/pages/audit-item/AuditItem.tsx";
import {fetchAuditItem} from "@/pages/audit-item/shared/audit-item.api.ts";
import {updateAudit} from "@/pages/audit-edit/shared/audit-edit.api.ts";
import type {ActionFunctionArgs, LoaderFunctionArgs} from "react-router-dom";

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
