import {Stack, TextField, Select, MenuItem, type SelectProps} from '@mui/material';
import React from 'react';

// Определяем тип для опций сортировки для большей типизации
export interface SortOption {
    field: string;
    label: string;
}

// Определяем пропсы нашего компонента
interface SearchAndSortProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    sortValue: { field: string; direction: 'asc' | 'desc' };
    onSortChange: (value: { field: string; direction: 'asc' | 'desc' }) => void;
    sortOptions: SortOption[];
    placeholder?: string;
    onEscapeKeyDown?: () => void;
    // Позволим кастомизировать некоторые пропсы у Select
    selectProps?: Omit<SelectProps, 'value' | 'onChange' | 'children'>;
}

/**
 * Компонент для поиска и сортировки.
 * Инкапсулирует логику отображения TextField и Select.
 */
export const SearchAndSort: React.FC<SearchAndSortProps> = ({
                                                                searchValue,
                                                                onSearchChange,
                                                                sortValue,
                                                                onSortChange,
                                                                sortOptions,
                                                                placeholder = 'Поиск...',
                                                                onEscapeKeyDown,
                                                                selectProps,
                                                            }) => {

    const selectValue = sortValue.field ? `${sortValue.field}-${sortValue.direction}` : '';

    // Обработчик изменения Select, который парсит значение и вызывает onSortChange
    const handleSelectChange = (value: string) => {
        if (value) {
            const [field, direction] = value.split('-');
            onSortChange({field, direction: direction as 'asc' | 'desc'});
        } else {
            onSortChange({field: '', direction: 'asc'});
        }
    };

    return (
        <Stack
            justifyContent="space-between"
            alignItems="flex-end"
            direction={{xs: 'column', sm: 'row'}}
            gap={2}
            mb={2}
        >
            <TextField
                fullWidth
                value={searchValue}
                placeholder={placeholder}
                onChange={e => onSearchChange(e.target.value)}
                onKeyDown={onEscapeKeyDown ? (e) => {
                    if (e.key === 'Escape') {
                        (e.target as HTMLInputElement).blur();
                        onEscapeKeyDown();
                    }
                } : undefined}
            />
            <Select
                {...selectProps}
                value={selectValue}
                onChange={e => handleSelectChange(e.target.value as string)}
                displayEmpty
                sx={{width: {xs: '100%', sm: 250}, ...selectProps?.sx}} // Позволяем переопределить стили
            >
                <MenuItem value="">
                    <em>Без сортировки</em>
                </MenuItem>
                {sortOptions.map(option =>
                    [{prefix: 'asc', label: 'По возрастанию'}, {prefix: 'desc', label: 'По убыванию'}].map(direction => (
                        <MenuItem key={option.field + direction.prefix}
                                  value={`${option.field}-${direction.prefix}`}>{option.label} ({direction.label})</MenuItem>
                    ))
                )}
            </Select>
        </Stack>
    );
};
