import {httpJson} from "@/shared/api.ts";
import type {AuditableObject, Section} from "@/pages/audits/shared/types.ts";

export function fetchSections(signal?: AbortSignal): Promise<Section[]> {
    return httpJson<Section[]>("/maturity-level", {signal});
}

export function fetchAuditItem(id: number): Promise<any> {
    return httpJson(`/audits/${id}`);
}

export function postReport(stateJson: string, signal?: AbortSignal): Promise<Report> {
    return httpJson<Report>("/audits", {
        method: "POST",
        body:   stateJson,
        signal,
    });
}

export function updateAudit(stateJson: string, signal?: AbortSignal): Promise<Report> {
    const id = JSON.parse(stateJson).id;
    return httpJson<Report>(`/audits/${id}`, {
        method: "PATCH",
        body:   stateJson,
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
