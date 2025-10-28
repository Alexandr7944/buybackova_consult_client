import {NewAudit} from "@/pages/new-audits/NewAudit.tsx";
import {fetchSections, postReport} from "@/pages/new-audits/shared/new-audit.api.ts";
import type {ActionFunctionArgs, LoaderFunctionArgs} from "react-router-dom";

export const Component = NewAudit;

export async function loader({request}: LoaderFunctionArgs) {
    return fetchSections(request.signal);
}

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const state = formData.get("state");

    if (typeof state !== "string" || state.length === 0) {
        return new Response(JSON.stringify({message: "Некорректные данные формы"}), {
            status:  400,
            headers: {"Content-Type": "application/json"},
        });
    }

    return postReport(state, request.signal);
}
