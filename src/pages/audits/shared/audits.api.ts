import {httpJson} from "@/shared/api.ts";
import type {Audit, AuditableObject, Section} from "@/pages/audits/shared/types.ts";

export function fetchSections(signal?: AbortSignal): Promise<Section[]> {
    return httpJson<Section[]>("/maturity-level", {signal});
}

export function fetchAuditItem(id: number): Promise<any> {
    return httpJson(`/audits/${id}`);
}

export function createAudit(stateJson: string, signal?: AbortSignal): Promise<Audit> {
    return httpJson<Audit>("/audits", {
        method: "POST",
        body:   stateJson,
        signal,
    });
}

export function updateAudit(stateJson: string, signal?: AbortSignal): Promise<Audit> {
    const id = JSON.parse(stateJson).id;
    return httpJson<Audit>(`/audits/${id}`, {
        method: "PATCH",
        body:   stateJson,
        signal,
    });
}

export function removeAudit(audit: string, signal?: AbortSignal): Promise<void> {
    const id: number = JSON.parse(audit).id;
    return httpJson<void>(`/audits/${id}`, {
        method: "DELETE",
        signal,
    });
}

export function fetchAuditableObjects(signal?: AbortSignal): Promise<AuditableObject[]> {
    return httpJson<AuditableObject[]>("/auditable-object", {signal});
}

export function fetchObject(objectId: number, signal?: AbortSignal): Promise<AuditableObject> {
    return httpJson<AuditableObject>(`/auditable-object/${objectId}`, {signal});
}

export function postNewAuditableObject(stateJson: string, signal?: AbortSignal): Promise<void> {
    return httpJson<void>("/auditable-object", {
        method: "POST",
        body:   stateJson,
        signal
    });
}

export function updateAuditableObject(stateJson: string, signal?: AbortSignal): Promise<void> {
    const id: number = JSON.parse(stateJson).id;
    return httpJson<void>(`/auditable-object/${id}`, {
        method: "PATCH",
        body:   stateJson,
        signal
    });
}
