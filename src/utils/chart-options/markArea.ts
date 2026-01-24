import {getLabelArea} from "@/utils/chart-options/label.ts";

const OPACITY = '15';

export const markArea = (values: { position: [number, number], text: string }[], color: string, maxValues: { y: number; x: number }) => {

    const data = values.map(({position, text}) =>
        [
            {
                coord: [
                    maxValues.x / 3 * (position[0] - 1),
                    maxValues.y / 3 * (position[1] - 1)
                ]
            },
            {
                coord: [
                    maxValues.x / 3 * position[0],
                    maxValues.y / 3 * position[1]
                ],
                ...getLabelArea(text)
            }
        ]
    );

    return {
        type:       'scatter',
        symbolSize: 0,
        data:       [],
        markArea:   {
            data,
            silent:    true,
            itemStyle: {
                color:       color + OPACITY,
                borderColor: color,
                borderWidth: 1,
                borderType:  'solid'
            },
        }
    };
}
