import type {LoaderFunctionArgs, ActionFunctionArgs} from "react-router-dom";
import {fetchAuditItem} from "@/pages/audit-item/shared/audit-item.api.ts";
import {AuditEdit} from "@/pages/audit-edit";
import {updateAudit} from "@/pages/audit-edit/shared/audit-edit.api.ts";
import {fetchSections} from "@/pages/new-audits/shared/new-audit.api.ts";

export const Component = AuditEdit;

export async function loader({params, request}: LoaderFunctionArgs) {
    const id = params.id;
    if (!id)
        return new Response(JSON.stringify({message: "Не указан ID"}), {
            status:  400,
            headers: {"Content-Type": "application/json"},
        });
    return Promise.all([
        fetchSections(request.signal),
        fetchAuditItem(+id)
    ]);
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
