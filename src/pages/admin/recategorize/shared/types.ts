export type BundleParams = {
    questions: Question[];
    categories: ParamsRow[];
    sections: ParamsRow[];
    tools: ParamsRow[];
}

export type ParamsRow = {
    id: number;
    title: string;
}

export type Question = {
    id: number;
    standard: string;
    question: string;
    categoryId: number;
    sectionId: number;
    toolId: number;
}
