import React, { useEffect, useState } from "react";
import { useFetcher, useLoaderData, useRevalidator } from "react-router-dom";
import { MaturityLevelInput } from "@/components/maturityLevel/MaturityLevelInput";
import { ReportCharts } from "@/components/maturityLevel/ReportCharts";
import type { Section, Report } from "./shared/types";

export const MaturityLevel: React.FC = () => {
    // Секции приходят из loader роутера
    const sections = useLoaderData() as Section[];
    // Отчёт возвращается из action через fetcher
    const fetcher = useFetcher<Report>();

    const [reports, setReports] = useState<Report | null>(null);
    const revalidator = useRevalidator();

    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data) {
            setReports(fetcher.data);
        }
    }, [fetcher.state, fetcher.data]);


    async function resetFormState() {
        localStorage.removeItem("maturityLevelFormState");

        await revalidator.revalidate();
        setReports(null);
    }

    function submitForm() {
        const state = localStorage.getItem("maturityLevelFormState");
        if (!state) return;

        const formData = new FormData();
        formData.set("state", state);

        fetcher.submit(formData, {method: "post"});
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
