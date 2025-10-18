import React, {useEffect, useState} from "react";
import {useFetcher, useLoaderData, useRevalidator} from "react-router-dom";
import {MaturityLevelInput} from "@/components/maturityLevel/MaturityLevelInput";
import {ReportCharts} from "@/components/maturityLevel/ReportCharts";
import type {Section, Report} from "./shared/types";

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
        <section>
            <div className="py-6 flex items-end justify-between gap-4">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Уровень клиентского опыта
                </h1>
                <div className="flex items-center gap-2">
                    {reports
                        ? <button
                            type="button"
                            onClick={() => setReports(null)}
                            className="button"
                        >
                            Редактировать
                        </button>
                        : <button
                            type="button"
                            onClick={resetFormState}
                            className="button"
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
        </section>
    )
};
