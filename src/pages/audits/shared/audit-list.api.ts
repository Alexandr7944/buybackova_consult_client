import {httpJson} from "@/shared/api.ts";
import type {AuditableObject} from "@/pages/auditable-objects/shared/types.ts";

export function fetchObject(objectId: number, signal?: AbortSignal): Promise<AuditableObject> {
    return httpJson<AuditableObject>(`/auditable-object/${objectId}`, {signal});
}

// export function postNewAuditableObject(stateJson: string, signal?: AbortSignal): Promise<void> {
//     return httpJson<void>("/auditable-object", {
//         method: "POST",
//         body:   stateJson,
//         signal
//     });
// }
