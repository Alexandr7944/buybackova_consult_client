import React, {useEffect, useMemo, useState} from "react";
import type {Section} from "../../pages/MaturityLevel.tsx";
import {LevelSelect} from "./LevelSelect.tsx";

export type FormState = Record<
    string,
    Record<string, number | null>
>;

interface MaturityLevelProps {
    sections: Section[];
    submitForm: () => void;
}

export const MaturityLevelInput: React.FC<MaturityLevelProps> = ({sections, submitForm}) => {
    const [state, setState] = useState<FormState>(() => createInitialState(sections));
    const [selectedSection, setSelectedSection] = useState<number[]>([]);

    useEffect(() => {
        setState(createInitialState(sections));
    }, [sections]);

    useEffect(() => {
        localStorage.setItem("maturityLevelFormState", JSON.stringify(state));
    }, [state]);

    const handleLevelChange = (sectionId: number, rowId: number, value: string | undefined) => {
        const numeric = value === undefined ? null : Number(value);
        setState((prev) => ({
            ...prev,
            [sectionId]: {
                ...prev[sectionId],
                [rowId]: numeric,
            },
        }));
    };

    const title = [
        `Выписка из рекомендации стандарта ISO 23592:2021` /*"Превосходный сервис: принципы и модель"*/,
        "Вопрос на аудите",
        "Вывод по итогам аудита"
    ];

    function createInitialState(sections: Section[]): FormState {
        const localFormState: string | null = localStorage.getItem("maturityLevelFormState");

        if (localFormState)
            return JSON.parse(localFormState);

        return sections.reduce<FormState>((acc, section) => {
            acc[section.id] = section.rows.reduce<Record<string, number | null>>((rowsAcc, row) => {
                    rowsAcc[row.id.toString()] = row.result;
                    return rowsAcc;
                },
                {}
            );
            return acc;
        }, {});
    }

    function selectSection(sectionId: number) {
        if (selectedSection.includes(sectionId)) {
            setSelectedSection(selectedSection.filter((id) => id !== sectionId));
        } else {
            setSelectedSection([...selectedSection, sectionId]);
        }
    }

    const getProgress = useMemo(() => {
        return sections.reduce((acc: Record<string, { result: number, total: number }>, section) => {
            const result = Object.values(state[section.id] || {})
                .filter((value) => value !== null && value >= 0)
                .length;

            const key = section.id.toString() as keyof typeof acc;
            acc[key] = {result, total: section.rows.length}
            return acc;
        }, {})
    }, [state]);

    return (
        <div className="overflow-hidden mt-6">
            <p className="my-4 text-sm text-gray-500">
                Заполните таблицу: оцените уровень из предложенных параметров.
            </p>
            <div className="overflow-x-auto  rounded-lg border border-gray-200 bg-white shadow-sm ">
                <table className="min-w-full divide-y divide-gray-200 ">
                    <thead className="bg-gray-50 ">
                    <tr>
                        {
                            title.map((title) => (
                                <th key={title}
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 ">
                                    {title}
                                </th>
                            ))
                        }
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 ">
                    {sections.map((section) => (
                        <React.Fragment key={section.id}>
                            {/* Заголовок раздела */}
                            <tr className="bg-gray-100/70">
                                <td colSpan={3}
                                    className="px-4 py-3  cursor-pointer text-sm font-medium text-gray-800"
                                    onClick={() => selectSection(section.id)}>
                                    <div className="flex items-center justify-between">
                                        <span className="flex-1">{section.title}</span>
                                        {getProgress[section.id].result} / {getProgress[section.id].total}
                                        <svg
                                            className={`w-4 h-4 ms-2 transform transition-transform duration-200 ${selectedSection.includes(section.id) ? "rotate-180" : ""}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                                        </svg>
                                    </div>
                                </td>
                            </tr>

                            {/* Строки раздела */}
                            {selectedSection.includes(section.id) &&
                                section.rows.map((row, idx) => {
                                    const value = state[section.id]?.[row.id];
                                    const isEven = idx % 2 === 1;
                                    return (
                                        <tr key={row.id} className={isEven ? "bg-white" : "bg-gray-50"}>
                                            <td className="whitespace-pre-wrap px-4 py-3 align-top text-sm text-gray-800">
                                                {row.standard}
                                            </td>
                                            <td className="whitespace-pre-wrap px-4 py-3 align-top text-sm text-gray-800">
                                                {row.question}
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <LevelSelect
                                                    value={value}
                                                    handleLevelChange={(select) => handleLevelChange(section.id, row.id, select)}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
                <button
                    type="button"
                    onClick={() => {
                        setSelectedSection([]);
                        submitForm();
                    }}
                    className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-inset
                    ring-gray-300 hover:bg-gray-200 cursor-pointer"
                >
                    Отправить
                </button>
            </div>
        </div>
    )
};
