import type {ReportItem} from "@/pages/MaturityLevel.tsx";
import {useMemo} from "react";
import ReactECharts from "echarts-for-react";

type Props = {
    reports: ReportItem[],
    title: string,
}

export const Chart = ({reports, title}: Props) => {
    const option = useMemo(() => ({
        radar:  {
            // shape:     'circle',
            indicator: reports.map(({title}) => ({name: title, max: 100, min: 0}))
        },
        series: [
            {
                type:  'radar',
                data:  [
                    {
                        name:  title,
                        value: reports.map(({result}) => result),
                    },
                ],
                label: {
                    show:      true,
                    formatter: (params: any) => params.value.toFixed() + '%',
                },
            }
        ]
    }), [reports]);

    return (
        <div>
            <h5 className="text-xl my-6">{title}</h5>
            <ReactECharts
                className="mt-6"
                option={option}
                style={{height: 400}}
            />
        </div>
    )
}
