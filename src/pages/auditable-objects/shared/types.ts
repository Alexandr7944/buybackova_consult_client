import type {Audit} from "@/pages/audits/shared/types.ts";

export interface AuditableObject {
    id: string;
    name: string;
    address: string;
    owner: string;
    audits: Audit[];
}
