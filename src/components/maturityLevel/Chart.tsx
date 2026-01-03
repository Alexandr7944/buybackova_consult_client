import {useMemo} from "react";
import ReactECharts from "echarts-for-react";
import type {ReportItem} from "@/pages/audits/shared/types.ts";

type Props = {
    ref: React.Ref<ReactECharts>;
    reports: ReportItem[];
    title: string;
};

export const Chart = ({ref, reports, title}: Props) => {
    const option = useMemo(
        () => ({
            radar:  {
                indicator: reports.map(({title}) => ({
                    name: title,
                    max:  100,
                    min:  0
                })),
                // Стиль осей (линий, идущих из центра)
                axisLine: {
                    lineStyle: {
                        color: "#888", // Цвет осей
                        width: 1, // Ширина осей
                    },
                },
                // Стиль разделительных линий (концентрические круги)
                splitLine: {
                    lineStyle: {
                        color: "#ccc", // Цвет разделительных линий
                        width: 1, // Ширина разделительных линий
                    },
                },
                // Стиль текста индикаторов (названий)
                axisName: {
                    color:      "#000", // Цвет текста
                    fontSize:   14, // Размер шрифта
                    fontWeight: 'normal',
                    formatter:  (value: string) => {
                        if (value.length <= 35)
                            return value;

                        let result = '';
                        let length = 0;

                        value.split(" ").forEach((word, index, arr) => {
                            if (length + word.length > 35) {
                                result += '\n';
                                length = 0;
                            }
                            result += word + " ";
                            length += word.length + 1;
                            if (index === arr.length - 1)
                                result = result.slice(0, -1);
                        })
                        return result;
                    },
                },
                // Стиль фоновых областей между линиями
                splitArea: {
                    areaStyle: {
                        color: ["#f5f5f5", "#e9e9e9"], // Градиент заливки
                    },
                },
            },
            animation: false,
            series: [
                {
                    type:  "radar",
                    data:  [
                        {
                            name:  title,
                            value: reports.map(({percentage}) => percentage),
                            // Стиль линии графика
                            lineStyle: {
                                color: "#1890ff", // Цвет линии
                                width: 3, // Ширина линии
                                type:  "solid", // Тип линии (solid, dashed, dotted)
                            },
                            // Стиль области под графиком
                            areaStyle: {
                                color: "rgba(24, 144, 255, 0.3)", // Цвет заливки с прозрачностью
                            },
                            // Стиль точек на графике
                            itemStyle: {
                                color:       "#1890ff", // Цвет точек
                                borderWidth: 2, // Ширина обводки точек
                            },
                        },
                    ],
                    label: {
                        show:       true,
                        formatter:  (params: any) => params.value.toFixed() + "%",
                        color:      "#333", // Цвет текста меток
                        fontWeight: "bold", // Жирность меток
                        fontSize:   12, // Размер шрифта меток
                    },
                },
            ],
        }),
        [reports, title]
    );

    return (
        <div className="px-4">
            <h5 className="text-xl my-6">{title}</h5>
            <ReactECharts
                ref={ref}
                className="mt-6"
                option={option}
                style={{height: 400}}
            />
        </div>
    );
};
