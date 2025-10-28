import {useMemo} from "react";
import ReactECharts from "echarts-for-react";
import type {ReportItem} from "@/pages/new-audits/shared/types.ts";

type Props = {
    reports: ReportItem[],
    title: string,
}

export const Chart = ({reports, title}: Props) => {
    const option = useMemo(() => ({
        radar:  {
            indicator: reports.map(({title}) => ({name: title, max: 100, min: 0}))
        },
        series: [
            {
                type:  'radar',
                data:  [
                    {
                        name:  title,
                        value: reports.map(({percentage}) => percentage),
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
