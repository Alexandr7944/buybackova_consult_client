import {useMemo} from "react";
import ReactECharts from "echarts-for-react";
import type {ReportItem} from "@/pages/audits/shared/types.ts";
import {markArea} from "@/utils/chart-options/markArea.ts";
import {areaTemplates} from "@/components/maturityLevel/areaTempates.ts";

type Props = {
    ref: React.Ref<ReactECharts>;
    reports: ReportItem[];
    title: string;
    type?: 'radar' | 'scatter';
};

export const Chart = ({ref, reports, title, type = 'radar'}: Props) => {
    const maxValues = useMemo(() => {
        return reports.reduce((acc, item) => {
            acc.y = Math.max(acc.y, item.resultByQuestion ?? 0);
            acc.x = Math.max(acc.x, (item.total ?? 0) / 3);
            return acc;
        }, {x: 0, y: 0});
    }, [reports]);

    const radarOption = () => ({
        radar:     {
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
        series:    [
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
    });
    const scatterOption = () => ({
        xAxis:   {
            type:          'value',
            name:          'Значимость инструмента при внедрении СХ-системы',
            nameLocation:  'middle',
            offset:        5,
            nameTextStyle: {
                fontSize:   14,
                fontWeight: 'bold',
                lineHeight: 56,
            }
        },
        yAxis:   {
            type:          'value',
            name:          'Уровень применения инструмента',
            nameLocation:  'middle',
            offset:        5,
            nameTextStyle: {
                fontSize:   14,
                fontWeight: 'bold',
                lineHeight: 56,
            }
        },
        tooltip: {
            trigger: 'item',
            // alwaysShowContent: true,
            formatter: (params: any) => `${params.value[2]}<br/>
                Значимость: ${params.value[0].toFixed()}<br/>
                Уровень применения: ${params.value[1].toFixed()}`
        },
        // visualMap: [
        //     {
        //         // Зоны для осей X
        //         type:      'piecewise',
        //         show:      false,
        //         dimension: 0, // Ось X
        //         pieces:    [
        //             {min: 0, max: 3, color: 'rgba(255, 0, 0, 0.1)'},   // Красная зона
        //             {min: 3, max: 7, color: 'rgba(255, 165, 0, 0.1)'}, // Оранжевая зона
        //             {min: 7, max: 10, color: 'rgba(0, 128, 0, 0.1)'}   // Зеленая зона
        //         ]
        //     },
        //     {
        //         // Зоны для осей Y
        //         type:      'piecewise',
        //         show:      false,
        //         dimension: 1, // Ось Y
        //         pieces:    [
        //             {min: 0, max: 3, color: 'rgba(255, 0, 0, 0.1)'},
        //             {min: 3, max: 7, color: 'rgba(255, 165, 0, 0.1)'},
        //             {min: 7, max: 10, color: 'rgba(0, 128, 0, 0.1)'}
        //         ]
        //     }
        // ],
        series: [
            ...(
                !maxValues.y || !maxValues.x
                    ? []
                    : areaTemplates.map(({values, color}) => markArea(values, color, maxValues))
            ),
            {
                symbolSize: 10,
                data:
                            reports.map
                            (({total, resultByQuestion, title}) => [(total ?? 0) / 3, resultByQuestion, title]),
                type,
                // ...getLabelData(),
            }
        ]
    });
    const option = useMemo(
        () => {
            if (type === 'radar')
                return radarOption();
            else if (type === 'scatter') {
                return scatterOption();
            }
        },
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

// option = {
//     xAxis:   {
//         type:          'value',
//         name:          'Значимость инструмента при внедрении СХ-системы',
//         nameLocation:  'middle',
//         offset:        5,
//         nameTextStyle: {
//             fontSize:   14,
//             fontWeight: 'bold',
//             lineHeight: 56,
//         }
//     },
//     yAxis:   {
//         type:          'value',
//         name:          'Уровень применения инструмента',
//         nameLocation:  'middle',
//         offset:        5,
//         nameTextStyle: {
//             fontSize:   14,
//             fontWeight: 'bold',
//             lineHeight: 56,
//         }
//     },
//     tooltip: {
//         trigger:   'item',
//         alwaysShowContent: true,
//     },
//     visualMap: [
//         {
//             // Зоны для осей X
//             type: 'piecewise',
//             show: false,
//             dimension: 0, // Ось X
//             pieces: [
//                 { min: 0, max: 3, color: 'rgba(255, 0, 0, 0.1)' },   // Красная зона
//                 { min: 3, max: 7, color: 'rgba(255, 165, 0, 0.1)' }, // Оранжевая зона
//                 { min: 7, max: 10, color: 'rgba(0, 128, 0, 0.1)' }   // Зеленая зона
//             ]
//         },
//         {
//             // Зоны для осей Y
//             type: 'piecewise',
//             show: false,
//             dimension: 1, // Ось Y
//             pieces: [
//                 { min: 0, max: 3, color: 'rgba(255, 0, 0, 0.1)' },
//                 { min: 3, max: 7, color: 'rgba(255, 165, 0, 0.1)' },
//                 { min: 7, max: 10, color: 'rgba(0, 128, 0, 0.1)' }
//             ]
//         }
//     ],
//
//     series: [
//         {
//             symbolSize: 20,
//             data: [],
//             type: 'scatter',
//             itemStyle: {
//                 color: '#1890ff',
//                 borderColor: '#fff',
//                 borderWidth: 2,
//                 shadowBlur: 5,
//                 shadowColor: 'rgba(0, 0, 0, 0.2)'
//             },
//             label: {
//                 show: true,
//                 position: 'top',
//                 distance: 15,
//                 formatter: (params) => {
//                     // Можно показывать имя или сокращенную информацию
//                     return params[0];
//                 },
//                 fontSize: 10,
//                 fontWeight: 'normal',
//                 color: '#333',
//                 backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                 borderColor: '#1890ff',
//                 borderWidth: 1,
//                 borderRadius: 4,
//                 padding: [3, 5],
//                 shadowBlur: 2,
//                 shadowColor: 'rgba(0, 0, 0, 0.1)'
//             },
//              emphasis: {
//                scale: true,
//                scaleSize: 15,
//                label: {
//                  show: true,
//                  fontWeight: 'bold',
//                  fontSize: 11,
//                  color: '#fff',
//                  backgroundColor: '#1890ff'
//                }
//              }
//         }
//     ]
// };
