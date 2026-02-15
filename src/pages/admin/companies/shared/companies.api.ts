import type {Company} from "@/pages/admin/companies/shared/types.ts";
import type {AuditableObject} from "@/pages/audits/shared/types.ts";
import apiClient from "@/shared/axios.ts";


export async function fetchUsers(): Promise<AuditableObject[]> {
    const response = await apiClient.get<AuditableObject[]>("/users");
    return response.data;
}

export async function fetchCompanies(): Promise<Company[]> {
    return apiClient.get('/companies')
        .then(response => response.data)
        .catch(() => []);
}

export async function createCompany(stateJson: string): Promise<Company | null> {
    return apiClient.post('/companies', stateJson)
        .then(response => response.data);
}

export async function updateCompany(stateJson: string): Promise<Company | null> {
    const id: number = JSON.parse(stateJson).id;
    return apiClient.patch(`/companies/${id}`, stateJson)
        .then(response => response.data);
}
