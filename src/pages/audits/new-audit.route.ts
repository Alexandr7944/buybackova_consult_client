import type {ActionFunctionArgs, LoaderFunctionArgs} from "react-router-dom";
import {NewAudit} from "@/pages/audits/NewAudit.tsx";
import {fetchSections, postReport} from "@/pages/audits/shared/audits.api.ts";

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
