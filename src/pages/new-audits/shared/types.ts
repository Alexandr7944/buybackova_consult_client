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

export type ReportItem = { title: string; percentage: number };

export type Report = {
    reportByCategory: ReportItem[];
    reportBySection: ReportItem[];
    total: { totalValue: number; description: string };
};
