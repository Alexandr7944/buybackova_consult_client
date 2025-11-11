import {type FC, type FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Box, Button, Container, Paper, Stack, TextField, Typography, Alert} from "@mui/material";
import apiClient from "@/shared/axios.ts";

export const Authorisation: FC<{}> = () => {
    const [formData, setFormData] = useState({username: '', password: ''});
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const setAlert = (message: string) => {
        setMessage(message);
        setTimeout(() => setMessage(''), 5000);
    };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.password)
            return setAlert('Все поля должны быть заполнены');

        try {
            const {data: result} = await apiClient.post<{
                user: { id: number, username: string },
                token: string
            }>('/auth/login', formData)

            if (result.token)
                localStorage.setItem('token', result.token);

            await navigate('../');
        } catch (err: Error | any) {
            if (err?.status === 401) {
                setAlert('Неправильный логин или пароль');
            }

            console.warn(err);
        }
    };

    return (
        <Container
            maxWidth="xs"
            sx={{display: 'flex', alignItems: 'center', minHeight: '100vh'}}
        >
            <Paper elevation={3} sx={{p: 3, width: '100%'}}>
                {message && <Alert severity="error" sx={{mb: 2}}>{message}</Alert>}
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    Войдите в свой аккаунт
                </Typography>

                <Box component="form" onSubmit={(e) => e.preventDefault()}>
                    <Stack spacing={2}>
                        <TextField
                            id="username"
                            name="username"
                            label="Логин"
                            type="text"
                            required
                            autoComplete="username"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            placeholder="Введите логин"
                            fullWidth
                        />

                        <TextField
                            id="password"
                            name="password"
                            label="Пароль"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="Введите пароль"
                            fullWidth
                        />

                        <Stack direction="row" spacing={1} justifyContent="space-between">
                            <Button
                                variant="outlined"
                                onClick={handleSubmit}
                                fullWidth
                            >
                                Войти
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    )
}
