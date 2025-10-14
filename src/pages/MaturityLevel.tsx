import React, {useEffect, useState} from "react";
import {MaturityLevelInput} from "../components/maturityLevel/MaturityLevelInput";
import {ReportCharts} from "../components/maturityLevel/ReportCharts.tsx";

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

export type ReportItem = { title: string, result: number };

export type Report = {
    reportByCategory: ReportItem[],
    reportBySection: ReportItem[],
    total: { totalValue: number, description: string }
}

export const MaturityLevel: React.FC = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const [reports, setReports] = useState<Report | null>(null);
    const serverURL = import.meta.env.MODE === "production"
        ? import.meta.env.VITE_SERVER_PATH
        : import.meta.env.VITE_URL_DEV_API;

    useEffect(() => {
        fetchSections();
    }, []);

    async function fetchSections() {
        try {
            const res = await fetch(serverURL + '/maturity-level')
            if (res.ok) {
                const data = await res.json();
                setSections(data);
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function resetFormState() {
        // localStorage.removeItem('maturityLevelFormState')
        // await fetchSections();
    }

    async function submitForm() {
        const state = localStorage.getItem('maturityLevelFormState');
        if (!state) return;

        const res = await fetch(serverURL + '/maturity-level/report', {
                headers: {'Content-Type': 'application/json'},
                method:  'POST',
                body:    state,
            }
        )

        if (res.ok) {
            const data = await res.json();
            console.log(data);
            setReports(data);
        }
    }

    return (
        <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex items-end justify-between gap-4">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Уровень клиентского опыта
                </h1>
                <div className="flex items-center gap-2">
                    {reports
                        ? <button
                            type="button"
                            onClick={() => setReports(null)}
                            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-200"
                        >
                            Редактировать
                        </button>
                        : <button
                            type="button"
                            onClick={resetFormState}
                            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-200"
                        >
                            Сбросить
                        </button>
                    }
                </div>
            </div>

            {
                reports
                    ? <ReportCharts reports={reports}/>
                    : sections.length > 0 && <MaturityLevelInput sections={sections} submitForm={submitForm}/>
            }
        </div>
    )
};
