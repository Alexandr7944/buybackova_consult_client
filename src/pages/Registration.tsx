import {type FC, type FormEvent, useState} from "react";
import {httpJson} from "@/shared/api.ts";
import {useNavigate} from "react-router-dom";
import {Box, Button, Container, Paper, Stack, TextField, Typography} from "@mui/material";

export const Registration: FC<{}> = () => {
    const [formData, setFormData] = useState({username: '', name: '', password: ''});
    const navigate = useNavigate();
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const result = await httpJson<{
                user: { id: number, username: string },
                token: string
            }>('/auth/registration', {
                method:  'POST',
                body:    JSON.stringify(formData),
                headers: {'Content-Type': 'application/json'}
            })

            if (result.token)
                localStorage.setItem('token', result.token);

            navigate('../');
        } catch (e) {
            console.warn(e);
        }
    };

    return (
        <Container
            maxWidth="xs"
            sx={{display: 'flex', alignItems: 'center', minHeight: '100vh'}}
        >
            <Paper elevation={3} sx={{p: 3, width: '100%'}}>
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    Регистрация
                </Typography>

                <Box component="form" onSubmit={(e) => e.preventDefault()}>
                    <Stack spacing={2}>
                        <TextField
                            id="name"
                            name="name"
                            label="Имя"
                            type="text"
                            required
                            autoComplete="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Введите имя"
                            fullWidth
                        />

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
                                onClick={() => navigate('/auth/login')}
                                fullWidth
                            >
                                Авторизация
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                fullWidth
                            >
                                Регистрация
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    )
}
