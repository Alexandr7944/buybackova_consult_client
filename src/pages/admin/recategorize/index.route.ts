import {CategoryReassignPanel} from "@/pages/admin/recategorize/CategoryReassignPanel.tsx";
import {fetchBundleParams, updateQuestion} from "@/pages/admin/recategorize/shared/recategorize.api.ts";
import type {ActionFunctionArgs} from "react-router-dom";

export const Component = CategoryReassignPanel;

export async function loader() {
    return fetchBundleParams();
}

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    if (formData.has('editQuestion')) {
        const state = formData.get("editQuestion");
        if (typeof state === 'string')
            return updateQuestion(state);
    }

    return new Response(JSON.stringify({message: "Некорректные данные формы"}), {
        status:  400,
        headers: {"Content-Type": "application/json"},
    });
}
