import type {Company} from "@/pages/admin/shared/types.ts";
import type {AuditableObject} from "@/pages/audits/shared/types.ts";
import apiClient from "@/shared/axios.ts";


export async function fetchUsers(signal?: AbortSignal): Promise<AuditableObject[]> {
    const response = await apiClient.get<AuditableObject[]>("/users", {signal});
    return response.data;
}

export async function fetchCompanies(): Promise<Company[]> {
    return apiClient.get('/companies')
        .then(response => response.data);
}

export async function createCompany(stateJson: string): Promise<Company | null> {
    return apiClient.post('/companies', {data: stateJson})
        .then(response => response.data);
}

export async function updateCompany(stateJson: string): Promise<Company | null> {
    const id: number = JSON.parse(stateJson).id;
    return apiClient.patch(`/companies/${id}`, {data: stateJson})
        .then(response => response.data);
}
