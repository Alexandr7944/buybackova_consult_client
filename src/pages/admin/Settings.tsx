import type {Company} from "@/pages/admin/shared/types.ts";
import {useLoaderData, useNavigate} from "react-router-dom";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button, Avatar, Chip, Stack, Tooltip,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import React, {useMemo} from "react";
import {CompanyForm} from "@/components/CompanyForm.tsx";
import {RenderIf} from "@/components/RenderIf.tsx";
import {SearchAndSort} from "@/components/ui/SearchAndSort.tsx";

type User = { id: number, name: string, companyId: number | null };

export const Settings = () => {
    const [companies, users] = useLoaderData<[Company[], User[]]>();
    const [openForm, setOpenForm] = React.useState(false);
    const [editingCompany, setEditingCompany] = React.useState<Company | undefined>();
    const [searchValue, setSearchValue] = React.useState('');
    const [sortValue, setSortValue] = React.useState<{ field: string, direction: 'asc' | 'desc' }>({field: '', direction: 'asc'});
    const navigate = useNavigate();

    const sortOptions = [
        {field: 'name', label: 'По названию'},
        {field: 'usersCount', label: 'По количеству сотрудников'},
    ];

    const processedCompanies = useMemo(() => {
        const search = searchValue.toLowerCase();
        let filtered = search
            ? companies.filter(company => company.name.toLowerCase().includes(search))
            : companies;

        if (sortValue.field) {
            filtered.sort((a, b) => {
                let aVal, bVal;
                if (sortValue.field === 'name') {
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                    return sortValue.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                } else if (sortValue.field === 'usersCount') {
                    aVal = a.users.length;
                    bVal = b.users.length;
                    return sortValue.direction === 'asc' ? aVal - bVal : bVal - aVal;
                }

                return 0;
            });
        }

        return filtered;
    }, [companies, searchValue, sortValue]);

    const usersForForm = useMemo(() => {
        if (!editingCompany)
            return users;

        return users.filter(user => {
            const isEmployee = user.companyId === editingCompany.id;
            const guestUser = user.companyId === null;
            return guestUser || isEmployee;
        });
    }, [users, editingCompany]);

    const handleOpenForm = (company?: Company) => {
        setEditingCompany(company);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setEditingCompany(undefined);
    };

    return (
        <div>
            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} mb={4}>
                <Typography variant="h5" component="h3">
                    Настроить компании
                </Typography>
                <Button variant="outlined" color="primary" onClick={() => setOpenForm(true)}>
                    Добавить компанию
                </Button>
            </Stack>

            <div>
                <SearchAndSort
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    sortValue={sortValue}
                    onSortChange={setSortValue}
                    sortOptions={sortOptions}
                    placeholder="Поиск по названию компании"
                    onEscapeKeyDown={() => setSearchValue('')}
                />
                <RenderIf
                    condition={processedCompanies.length > 0}
                    fallbackMessage={searchValue ? 'Компании, соответствующие вашему запросу, не найдены.' : 'Нет компаний.'}
                    containerProps={{pl: 4}}
                >
                    {processedCompanies.map((company) => (
                        <Accordion key={company.id}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <Typography component="span" sx={{width: '33%', flexShrink: 0}}>{company.name}</Typography>
                                <Typography component="span"
                                            sx={{color: 'text.secondary'}}>{company?.owner?.name || "Выберете владельца"}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack spacing={2}>
                                    {/* Блок с сотрудниками */}
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <GroupIcon fontSize="small" color="action"/>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Сотрудники ({company.users.length}):
                                        </Typography>
                                    </Stack>

                                    <RenderIf
                                        condition={company.users.length > 0}
                                        fallbackMessage="Нет сотрудников"
                                        containerProps={{pl: 4}}
                                    >
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            {company.users.map((user) => (
                                                <Chip
                                                    key={user.id}
                                                    avatar={<Avatar sx={{width: 24, height: 24}}><PersonIcon fontSize="small"/></Avatar>}
                                                    label={user.name}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            ))}
                                        </Stack>
                                    </RenderIf>

                                    {/* Блок с объектами */}
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{mt: 1}}>
                                        <BusinessIcon fontSize="small" color="action"/>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Объекты ({company.objects.length}):
                                        </Typography>
                                    </Stack>

                                    <RenderIf
                                        condition={company.objects.length > 0}
                                        fallbackMessage="Нет объектов"
                                        containerProps={{pl: 4}}
                                    >
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            {company.objects.map((object) => (
                                                <Tooltip title={object.address} key={object.id} placement="top">
                                                    <Chip
                                                        label={object.name}
                                                        variant="filled"
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => navigate(`/object/${object.id}`)}
                                                    />
                                                </Tooltip>
                                            ))}
                                        </Stack>
                                    </RenderIf>
                                </Stack>

                                <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                                    <Button variant="outlined" onClick={() => handleOpenForm(company)}>
                                        Редактировать
                                    </Button>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </RenderIf>
            </div>

            {openForm && <CompanyForm
                onClose={handleCloseForm}
                company={editingCompany}
                users={usersForForm}
            />}
        </div>
    )
}
