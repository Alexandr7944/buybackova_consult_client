import apiClient from "@/shared/axios.ts";
import type {Audit, AuditableObject, Section} from "@/pages/audits/shared/types.ts";

export async function fetchSections(signal?: AbortSignal): Promise<Section[]> {
    const response = await apiClient.get<Section[]>("/maturity-level", {signal});
    return response.data;
}

export async function fetchAuditItem(id: number): Promise<Audit> {
    const response = await apiClient.get<Audit>(`/audits/${id}`);
    return response.data;
}

export async function createAudit(stateJson: string, signal?: AbortSignal): Promise<Audit> {
    const response = await apiClient.post<Audit>("/audits", stateJson, {signal});
    return response.data;
}

export async function updateAudit(stateJson: string, signal?: AbortSignal): Promise<Audit> {
    const id = JSON.parse(stateJson).id;
    const response = await apiClient.patch<Audit>(`/audits/${id}`, stateJson, {signal});
    return response.data;
}

export async function removeAudit(audit: string, signal?: AbortSignal): Promise<void> {
    const id: number = JSON.parse(audit).id;
    const response = await apiClient.delete<void>(`/audits/${id}`, {signal,});
    return response.data;
}

export async function fetchAuditableObjects(signal?: AbortSignal): Promise<AuditableObject[]> {
    const response = await apiClient.get<AuditableObject[]>("/auditable-object", {signal});
    return response.data;
}

export async function fetchObject(objectId: number, signal?: AbortSignal): Promise<AuditableObject> {
    const response = await apiClient.get<AuditableObject>(`/auditable-object/${objectId}`, {signal});
    return response.data;
}

export async function postNewAuditableObject(stateJson: string, signal?: AbortSignal): Promise<void> {
    const response = await apiClient.post<void>("/auditable-object", stateJson, {signal});
    return response.data;
}

export async function updateAuditableObject(stateJson: string, signal?: AbortSignal): Promise<void> {
    const id: number = JSON.parse(stateJson).id;
    const response = await apiClient.patch<void>(`/auditable-object/${id}`, stateJson, {signal});
    return response.data;
}
