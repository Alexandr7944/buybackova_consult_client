import {useLoaderData} from "react-router-dom";
import type {BundleParams} from "@/pages/admin/recategorize/shared/types.ts";
import {MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

export const CategoryReassignPanel = () => {
    const data = useLoaderData<BundleParams>();
    const titles = [
        {id: 'standard', label: 'Стандарт', minWidth: '500px'},
        {id: 'question', label: 'Вопросы', minWidth: '500px'},
        {id: 'section', label: 'Секции'},
        {id: 'category', label: 'Категории'},
        {id: 'tool', label: 'Инструменты'},
    ];

    return (
        <Paper>
            <TableContainer sx={{overflow: 'hidden', overflowX: 'auto'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {titles.map(({id, label, minWidth}) =>
                                <TableCell key={id} style={{minWidth}}>{label}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.questions.map(question => (
                                <TableRow key={question.id}>
                                    <TableCell>{question.standard}</TableCell>
                                    <TableCell>{question.question}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={question.sectionId || 0}
                                            label="Секция"
                                            sx={{width: 250}}
                                            onChange={() => {
                                            }}
                                        >
                                            {
                                                data.sections.map(({id, title}) => (
                                                    <MenuItem key={id} value={id}>{title}</MenuItem>
                                                ))
                                            }
                                            <MenuItem value={0}>Не определен</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={question.categoryId || 0}
                                            label="Категория"
                                            sx={{width: 250}}
                                            onChange={() => {
                                            }}
                                        >
                                            {
                                                data.categories.map(({id, title}) => (
                                                    <MenuItem key={id} value={id}>{title}</MenuItem>
                                                ))
                                            }
                                            <MenuItem value={0}>Не определен</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={question.toolId || 0}
                                            label="Инструмент"
                                            sx={{width: 250}}
                                            onChange={() => {
                                            }}
                                        >
                                            {
                                                data.tools.map(({id, title}) => (
                                                    <MenuItem key={id} value={id}>{title}</MenuItem>
                                                ))
                                            }
                                            <MenuItem value={0}>Не определен</MenuItem>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
