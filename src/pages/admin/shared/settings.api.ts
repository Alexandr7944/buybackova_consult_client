import type {Company} from "@/pages/admin/shared/types.ts";
import {httpJson} from "@/shared/api.ts";
import type {AuditableObject} from "@/pages/audits/shared/types.ts";



export function fetchUsers(signal?: AbortSignal): Promise<AuditableObject[]> {
    return httpJson<AuditableObject[]>("/users", {signal});
}

export async function fetchCompanies(): Promise<Company[]> {
    return httpJson('/companies');
}

export async function createCompany(stateJson: string): Promise<Company | null> {
    return httpJson('/companies', {
        method: 'POST',
        body: stateJson
    });
}

export async function updateCompany(stateJson: string): Promise<Company | null> {
    const id: number = JSON.parse(stateJson).id;
    return httpJson(`/companies/${id}`, {
        method: 'PATCH',
        body: stateJson
    });
}
