import {httpJson} from "@/shared/api.ts";

export function fetchAuditItem(id: number): Promise<any> {
    return httpJson(`/audits/${id}`);
}
