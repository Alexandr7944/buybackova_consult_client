import {getLabelArea} from "@/utils/chart-options/label.ts";

const OPACITY = '15';
const STEP_Y = 5;
const STEP_X = 8.3;

export const markArea = (values: { position: [number, number], text: string }[], color: string) => {
    const data = values.map(({position, text}) =>
        [
            {
                coord: position
            },
            {
                coord: [position[0] + STEP_Y, (position[1] + STEP_X).toFixed(2)],
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
