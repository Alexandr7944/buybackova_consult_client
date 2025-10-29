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

export type Row = {
    id: number;
    standard: string;
    question: string;
    result: number | null;
};

export type Section = {
    id: number;
    title: string;
    rows: Row[];
};

export type ReportItem = {
    title: string;
    percentage: number
};

export type Report = {
    reportByCategory: ReportItem[];
    reportBySection: ReportItem[];
    total: { totalValue: number; description: string };
};


export interface AuditableObject {
    id: string;
    name: string;
    address: string;
    owner: string;
    audits: Audit[];
}
