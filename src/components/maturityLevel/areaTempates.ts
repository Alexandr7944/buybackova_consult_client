interface AreaTemplate {
    values: { position: [number, number], text: string }[],
    color: string
}

export const areaTemplates: AreaTemplate[] = [
    {
        values: [{position: [3, 3], text: 'Все отлично!'}],
        color:  '#52c41a'
    },
    {
        values: [
            {position: [2, 3], text: 'Оценить\nцелесообразность\nиспользования\nинструмента'},
            {position: [3, 2], text: 'Требуется\nдоработка\nинструмента'},
        ],
        color:  '#cfcfcf'
    },
    {
        values: [
            {position: [2, 1], text: 'Оценить\nцелесообразность\nвнедрения\nинструмента'},
            {position: [2, 2], text: 'Оценить\nцелесообразность\nдоработки и\nиспользования\nинструмента'},
        ],
        color:  '#faad14'
    },
    {
        values: [
            {position: [1, 1], text: 'Не влияет на CX,\nможно отказаться'},
            {position: [1, 2], text: 'Не влияет на CX,\nможно отказаться'},
            {position: [1, 3], text: 'Не влияет на CX,\nможно отказаться'},
            {position: [3, 1], text: 'Требуется\nвнедрение\nинструмента'},
        ],
        color:  '#ff4d4f'
    }
]
