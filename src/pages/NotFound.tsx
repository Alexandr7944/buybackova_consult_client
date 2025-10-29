import * as React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);
  const handleRefresh = () => window.location.reload();

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, maxWidth: 720, width: "100%" }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography variant="h2" component="h1" sx={{ fontWeight: 700, fontSize: { xs: 36, sm: 48 } }}>
            404
          </Typography>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Страница не найдена
          </Typography>
          <Typography color="text.secondary">
            Похоже, вы перешли по неверной ссылке или страница была перемещена. Проверьте адрес
            в строке браузера или воспользуйтесь действиями ниже.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<HomeIcon />}
              component={RouterLink}
              to="/"
            >
              На главную
            </Button>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
              Назад
            </Button>
            <Button variant="text" startIcon={<RefreshIcon />} onClick={handleRefresh}>
              Обновить
            </Button>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Если ошибка повторяется, сообщите нам, указав, как вы сюда попали.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};
