import {useFetcher, useLoaderData} from "react-router-dom";
import type {BundleParams, Question} from "@/pages/admin/recategorize/shared/types.ts";
import {
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import {useState} from "react";
import {CellEditor} from "@/components/recotigorizeComponents/CellEditor.tsx";

export const CategoryReassignPanel = () => {
    const data = useLoaderData<BundleParams>();
    const fetcher = useFetcher();
    const [editedCell, setEditedCell] = useState<{ id: number, type: string } | null>(null);
    const [editedQuestion, setEditedQuestion] = useState<Question | null>(null)

    const titles = [
        {id: 'id', label: '№'},
        {id: 'standard', label: 'Стандарт', minWidth: '500px'},
        {id: 'question', label: 'Вопросы', minWidth: '500px'},
        {id: 'section', label: 'Секции'},
        {id: 'category', label: 'Категории'},
        {id: 'tool', label: 'Инструменты'},
    ];

    const editCell = (type: string, question: Question) => {
        if (editedCell) {
            return console.log('Edited item!');
        }

        setEditedCell({id: question.id, type});
        setEditedQuestion(question);
    }

    const resetCell = () => {
        setEditedCell(null);
        setEditedQuestion(null);
    }

    const saveCell = async () => {
        if (!editedQuestion) {
            return console.log('editedQuestion is null');
        }

        const formData = new FormData();
        formData.set("editQuestion", JSON.stringify(editedQuestion));
        await fetcher.submit(formData, {method: "PATCH"});
        resetCell();
    }

    const selectParameter = async (question: Question) => {
        const formData = new FormData();
        formData.set("editQuestion", JSON.stringify(question));
        await fetcher.submit(formData, {method: "PATCH"});
        resetCell();
    }

    return (
        <Paper>
            <TableContainer sx={{overflow: 'hidden', overflowX: 'auto'}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {titles.map(({id, label, minWidth}) =>
                                <TableCell
                                    key={id}
                                    style={{minWidth}}
                                >
                                    {label}
                                </TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.questions.map(question => (
                                <TableRow key={question.id} style={{verticalAlign: 'top'}}>
                                    <TableCell>{question.id}</TableCell>
                                    <CellEditor
                                        value={question.standard}
                                        isEdit={editedCell?.id === question.id && editedCell?.type === 'standard' && !!editedQuestion}
                                        editValue={editedQuestion?.standard}
                                        onChange={val => editedQuestion && setEditedQuestion({...editedQuestion, standard: val})}
                                        selectItem={() => editCell('standard', question)}
                                        resetCell={resetCell}
                                        saveCell={saveCell}
                                    />
                                    <CellEditor
                                        value={question.question}
                                        isEdit={editedCell?.id === question.id && editedCell?.type === 'question' && !!editedQuestion}
                                        editValue={editedQuestion?.question}
                                        onChange={val => editedQuestion && setEditedQuestion({...editedQuestion, question: val})}
                                        selectItem={() => editCell('question', question)}
                                        resetCell={resetCell}
                                        saveCell={saveCell}
                                    />
                                    <TableCell>
                                        <Select
                                            value={question.sectionId || 0}
                                            label="Секция"
                                            sx={{width: 250}}
                                            onChange={(e) => selectParameter({...question, sectionId: e.target.value})}
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
                                            onChange={(e) => selectParameter({...question, categoryId: e.target.value})}
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
                                            onChange={(e) => selectParameter({...question, toolId: e.target.value})}
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
