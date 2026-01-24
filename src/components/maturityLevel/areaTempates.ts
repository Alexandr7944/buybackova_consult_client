interface AreaTemplate {
    values: { position: [number, number], text: string }[],
    color: string
}

export const areaTemplates: AreaTemplate[] = [
    {
        values: [{position: [10, 16.6], text: 'Все отлично!'}],
        color:  '#52c41a'
    },
    {
        values: [
            {position: [5, 16.6], text: 'Оценить\nцелесообразность\nиспользования\nинструмента'},
            {position: [10, 8.3], text: 'Требуется\nдоработка\nинструмента'},
        ],
        color:  '#cfcfcf'
    },
    {
        values: [
            {position: [5, 0], text: 'Оценить\nцелесообразность\nвнедрения\nинструмента'},
            {position: [5, 8.3], text: 'Оценить\nцелесообразность\nдоработки и\nиспользования\nинструмента'},
        ],
        color:  '#faad14'
    },
    {
        values: [
            {position: [0, 0], text: 'Не влияет на CX,\nможно отказаться'},
            {position: [0, 8.3], text: 'Не влияет на CX,\nможно отказаться'},
            {position: [0, 16.6], text: 'Не влияет на CX,\nможно отказаться'},
            {position: [10, 0], text: 'Требуется\nвнедрение\nинструмента'},
        ],
        color:  '#ff4d4f'
    }
]
