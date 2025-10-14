import type {Report} from "../../pages/MaturityLevel.tsx";
import {Chart} from "./Chart.tsx";
import {useMemo} from "react";
import {format} from "date-fns";

export const ReportCharts = ({reports}: { reports: Report }) => {
    const tableData = useMemo(() => [
        {title: 'Организация: ', value: '__'},
        {title: 'Дата оценки: ', value: format(new Date(), 'dd.MM.yyyy')},
        {title: "Общая оценка уровня развития системы управления клиентским опытом", value: reports.total.totalValue + '%'},
        {title: "Уровень зрелости", value: reports.total.description},
    ], [reports])

    return (
        <div>
            <h3 className="text-xl font-semibold tracking-tight text-gray-900">
                Отчет по оценке уровня развития системы управления клиентским опытом
            </h3>

            <div className="mt-6 overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-md">
                    <tbody className="divide-y divide-gray-200">
                    {
                        tableData.map((item, index) => (
                            <tr key={index}>
                                <th scope="row"
                                    className="px-4 py-3 text-sm text-left font-normal text-gray-900">
                                    {item.title}
                                </th>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {item.value}
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>

            <Chart
                title="Анализ по разделам стандарта ISO 23592:2021"
                reports={reports.reportBySection}
            />
            <Chart
                title="Анализ по категориям СХ-системы"
                reports={reports.reportByCategory}
            />
        </div>
    )
};
