import type {ActionFunctionArgs} from "react-router-dom";
import {Companies} from "@/pages/admin/companies/Companies.tsx";
import {createCompany, fetchCompanies, fetchUsers, updateCompany} from "@/pages/admin/companies/shared/companies.api.ts";

export const Component = Companies;


export async function loader() {
    return Promise.all([
        fetchCompanies(),
        fetchUsers()
    ])
}

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    if (formData.has('updateForm')) {
        const state = formData.get("updateForm");
        if (typeof state === 'string')
            return updateCompany(state);
    } else if (formData.has('createForm')) {
        const state = formData.get("createForm");
        if (typeof state === 'string')
            return createCompany(state);
    }

    return new Response(JSON.stringify({message: "Некорректные данные формы"}), {
        status:  400,
        headers: {"Content-Type": "application/json"},
    });
}
