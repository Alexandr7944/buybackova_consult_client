import type {AuditableObject} from "@/pages/auditable-objects/shared/types.ts";

export type Audit = {
    id: number;
    object: AuditableObject;
    objectId: number;
    auditorName: string;
    ownerSignerName: string;
    createdAt: Date;
    date: Date;
    resultValue: number;
    resultDescription: string;
    sectionDescription: string | null;
    categoryDescription: string | null;
    reportDescription: string | null;
    formState: Record<string, number>;
    results: {
        id: number;
        type: string;
        percentage: number;
        title: string;
    }[]
}
