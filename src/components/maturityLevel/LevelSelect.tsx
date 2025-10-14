import React from "react";

type PropsType = {
    value: number | null;
    handleLevelChange: (value: string | undefined) => void;
}

export const LevelSelect: React.FC<PropsType> = ({value, handleLevelChange}) => {
    const levelOptions = [
        {title: "Свидетельства предоставлены в полном объеме", value: 3},
        {title: "Частично реализовано", value: 1},
        {title: "Нет свидетельств о реализации положения стандарта", value: 0},
    ];

    return (
        <select
            className="block w-28 p-2 rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={value ?? ""}
            onChange={(e) => handleLevelChange(e.target.value)}
        >
            <option value={undefined}>—</option>
            {levelOptions.map(({title, value}) => (
                <option key={value} value={value}>
                    {title}
                </option>
            ))}
        </select>
    )
}
