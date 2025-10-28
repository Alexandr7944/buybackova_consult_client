import {httpJson} from "@/shared/api";
import type {Report} from "./types";

export function updateAudit(stateJson: string, signal?: AbortSignal): Promise<Report> {
    const id = JSON.parse(stateJson).id;
    return httpJson<Report>(`/audits/${id}`, {
        method: "PATCH",
        body:   stateJson,
        signal,
    });
}
