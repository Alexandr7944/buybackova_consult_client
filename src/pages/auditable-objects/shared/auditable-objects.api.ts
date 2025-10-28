import type {AuditableObject} from "@/pages/auditable-objects/shared/types.ts";
import {httpJson} from "@/shared/api.ts";

export function fetchAuditableObjects(signal?: AbortSignal): Promise<AuditableObject[]> {
    return httpJson<AuditableObject[]>("/auditable-object", {signal});
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
