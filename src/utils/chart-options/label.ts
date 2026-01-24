export const getLabelArea = (text: string) => ({
    label: {
        position:      ['50%', '50%'],
        width:         '100%',
        height:        '100%',
        align:         'center',
        verticalAlign: 'middle',
        formatter:     text,
        color:         'rgba(51,51,51,0.9)',
        fontSize:      14,
    }
})

export const getLabelData = () => ({
    label: {
        show:            true,
        position:        'TopLeft',
        distance:        15,
        formatter:       ({data}: { data: [number, number, string] }) => {
            return data[2];
            // return `${data[1]} - ${data[0]}`;
            // return `${data[2]} \n ${data[1]} - ${data[0]}`;
        },
        fontSize:        10,
        fontWeight:      'normal',
        color:           '#333',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor:     '#1890ff',
        borderWidth:     1,
        borderRadius:    4,
        padding:         [3, 5],
        shadowBlur:      2,
        shadowColor:     'rgba(0, 0, 0, 0.1)'
    },
})
