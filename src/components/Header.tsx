import {useState, type FC} from "react";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {clearSessionCache} from "@/auth/session.ts";
import {
    AppBar,
    Toolbar,
    Container,
    Box,
    Button,
    Stack,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Logout from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {logout} from "@/store/useAuthStore.ts";
import {useAppDispatch, useAppSelector} from "@/hooks/hook.ts";
import {RenderIf} from "@/components/RenderIf.tsx";
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import CheckIcon from '@mui/icons-material/Check';
import {CLIENT_ROUTES} from "@/router/constants.ts";

export const Header: FC = () => {
    const {user, isAdmin} = useAppSelector(state => state.useAuthStore);
    const dispatch = useAppDispatch();
    const [open, toggleDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const toggleMobile = () => setMobileOpen(v => !v);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const navigate = useNavigate();
    const handleLogout = async () => {
        handleMenuClose();
        await clearSessionCache();
        dispatch(logout());
        navigate(CLIENT_ROUTES.LOGIN);
    };

    const links = [
        {name: "Объекты", to: CLIENT_ROUTES.HOME, icon: <CheckIcon/>},
        // {name: "Об авторах методологии", to: CLIENT_ROUTES.ABOUT, icon: ''},
        {name: "Методология", to: CLIENT_ROUTES.METHODOLOGY, icon: <CheckIcon/>},
        // {name: "Контакты", to: "/contacts", icon: ''},
    ];

    const linksForAdmin = [
        {name: "Компании", to: CLIENT_ROUTES.COMPANIES, icon: <BusinessIcon/>},
        {name: "Параметры", to: CLIENT_ROUTES.SETTINGS_REPORT, icon: <SettingsIcon/>}
    ]

    const drawer = (
        <Box role="presentation" sx={{width: 260}} onClick={toggleMobile}>
            <List>
                {(isAdmin ? [...linksForAdmin, ...links] : links).map(l => (
                    <ListItem key={l.to} disablePadding>
                        <ListItemButton component={RouterLink} to={l.to}>
                            <ListItemIcon>{l.icon}</ListItemIcon>
                            <ListItemText primary={l.name}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box px={2} pb={2}>
                {!(user && user.username)
                    ? <Stack gap={2}>
                        <Button fullWidth variant="contained" aria-label="auth actions" onClick={() => navigate(CLIENT_ROUTES.LOGIN)}>Вход</Button>
                        <Button fullWidth variant="contained" aria-label="auth actions"
                                onClick={() => navigate(CLIENT_ROUTES.REGISTRATION)}>Регистрация</Button>
                    </Stack>
                    : <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleLogout}
                        startIcon={<Logout/>}
                    >
                        Выйти
                    </Button>
                }
            </Box>
        </Box>
    );

    return (
        <AppBar position="sticky" color="primary" enableColorOnDark>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{gap: 2}}>
                    <Box sx={{display: {xs: 'inline-flex', md: 'none'}}}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={toggleMobile}
                            aria-label="open drawer"
                        >
                            <MenuIcon/>
                        </IconButton>
                    </Box>

                    <Button
                        color="inherit"
                        component={RouterLink}
                        to={CLIENT_ROUTES.HOME}
                        sx={{fontWeight: 700, letterSpacing: 0.3}}
                    >
                        ВАУbakova
                    </Button>

                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}, gap: 2}}>
                        <RenderIf condition={isAdmin}>
                            <Button
                                color="inherit"
                                className="text-nowrap"
                                onClick={() => toggleDrawer(true)}
                            >
                                Админ
                            </Button>
                        </RenderIf>
                        {links.map(l => (
                            <Button
                                key={l.to}
                                color="inherit"
                                component={RouterLink}
                                to={l.to}
                                className="text-nowrap"
                            >
                                {l.name}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center', gap: 1}}>
                        {!(user && user.username) ? (
                            <>
                                <IconButton color="inherit" onClick={handleMenuOpen}>
                                    <PersonOutlineOutlinedIcon/>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={!!anchorEl}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                    transformOrigin={{vertical: 'top', horizontal: 'right'}}
                                >
                                    <MenuItem disabled>
                                        <ListItemIcon>
                                            <AccountCircle fontSize="small"/>
                                        </ListItemIcon>
                                        <ListItemText>
                                            <Typography variant="body2">{user?.username ?? 'Гость'}</Typography>
                                        </ListItemText>
                                    </MenuItem>
                                    <Divider/>
                                    <MenuItem onClick={() => navigate(CLIENT_ROUTES.LOGIN)}>
                                        <ListItemText>Вход</ListItemText>
                                    </MenuItem>
                                    <MenuItem onClick={() => navigate(CLIENT_ROUTES.REGISTRATION)}>
                                        <ListItemText>Регистрация</ListItemText>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <IconButton color="inherit" onClick={handleMenuOpen}>
                                    <AccountCircle/>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={!!anchorEl}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                    transformOrigin={{vertical: 'top', horizontal: 'right'}}
                                >
                                    <MenuItem disabled>
                                        <ListItemIcon>
                                            <AccountCircle fontSize="small"/>
                                        </ListItemIcon>
                                        <ListItemText>
                                            <Typography variant="body2">{user?.username}</Typography>
                                        </ListItemText>
                                    </MenuItem>
                                    <Divider/>
                                    <MenuItem onClick={handleLogout}>
                                        <ListItemIcon>
                                            <Logout fontSize="small"/>
                                        </ListItemIcon>
                                        Выйти
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>

            <Drawer
                open={open}
                onClose={() => toggleDrawer(false)}
            >
                <nav aria-label="main mailbox folders">
                    <List sx={{minWidth: 360}}>
                        {
                            linksForAdmin.map(l => (
                                <ListItem key={l.to} disablePadding>
                                    <ListItemButton
                                        color="inherit"
                                        component={RouterLink}
                                        to={l.to}
                                    >
                                        <ListItemIcon>{l.icon}</ListItemIcon>
                                        <ListItemText primary={l.name}/>
                                    </ListItemButton>
                                </ListItem>
                            ))
                        }
                    </List>
                </nav>
            </Drawer>

            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={toggleMobile}
                ModalProps={{keepMounted: true}}
                sx={{display: {xs: 'block', md: 'none'}}}
            >
                {drawer}
            </Drawer>
        </AppBar>
    );
};
