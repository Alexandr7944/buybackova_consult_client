import {useFetcher, useLoaderData} from "react-router-dom";
import type {BundleParams, Question} from "@/pages/admin/recategorize/shared/types.ts";
import {
    Button,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextareaAutosize
} from "@mui/material";
import {useState} from "react";

export const CategoryReassignPanel = () => {
    const data = useLoaderData<BundleParams>();
    const fetcher = useFetcher();
    const [editedCell, setEditedCell] = useState<{ id: number, type: 'standard' | 'question' } | null>(null);
    const [editedQuestion, setEditedQuestion] = useState<Question | null>(null)

    const titles = [
        {id: 'id', label: '№'},
        {id: 'standard', label: 'Стандарт', minWidth: '500px'},
        {id: 'question', label: 'Вопросы', minWidth: '500px'},
        {id: 'section', label: 'Секции'},
        {id: 'category', label: 'Категории'},
        {id: 'tool', label: 'Инструменты'},
    ];

    const editCell = (question: Question) => {
        if (editedCell) {
            return console.log('Edited item!');
        }

        setEditedCell({id: question.id, type: 'standard'});
        setEditedQuestion(question);
    }

    const resetCell = () => {
        setEditedCell(null);
        setEditedQuestion(null);
    }

    const saveCell = async () => {
        const formData = new FormData();
        formData.set("editQuestion", JSON.stringify(editedQuestion));
        await fetcher.submit(formData, {method: "PATCH"});
        resetCell();
    }

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
                                    <TableCell>{question.id}</TableCell>
                                    <TableCell>
                                        {
                                            (editedCell?.id === question.id && editedCell?.type === 'standard' && editedQuestion)
                                                ? <Stack>
                                                    <TextareaAutosize
                                                        value={editedQuestion?.standard}
                                                        onChange={e => setEditedQuestion({...editedQuestion, standard: e.target.value})}
                                                        style={{width: '100%'}}
                                                    />
                                                    <Stack direction='row' justifyContent='flex-end'>
                                                        <Button onClick={resetCell}>Отменить</Button>
                                                        <Button onClick={saveCell}>Сохранить</Button>
                                                    </Stack>
                                                </Stack>
                                                : <span onClick={() => editCell(question)}>{question.standard}</span>
                                        }
                                    </TableCell>
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
