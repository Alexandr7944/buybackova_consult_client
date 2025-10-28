import {useState, type FC} from "react";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {clearSessionCache} from "@/auth/session.ts";
import {
    AppBar,
    Toolbar,
    Container,
    Box,
    Button,
    ButtonGroup,
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
import {logout, type User} from "@/store/useAuthStore.ts";
import {useAppDispatch, useAppSelector} from "@/hooks/hook.ts";

export const Header: FC = () => {
    const user: User | undefined = useAppSelector(state => state.useAuthStore.user);
    const dispatch = useAppDispatch();

    const [mobileOpen, setMobileOpen] = useState(false);
    const toggleMobile = () => setMobileOpen(v => !v);

    // user menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const navigate = useNavigate();
    const handleLogout = () => {
        handleMenuClose();
        clearSessionCache();
        dispatch(logout());
        navigate('/auth/login');
    };

    const links = [
        {name: "Главная", to: "/"},
        {name: "О нас", to: "/about"},
        {name: "Услуги", to: "/services"},
        {name: "Контакты", to: "/contacts"}
    ];

    const drawer = (
        <Box role="presentation" sx={{ width: 260 }} onClick={toggleMobile}>
            <List>
                {links.map(l => (
                    <ListItem key={l.to} disablePadding>
                        <ListItemButton component={RouterLink} to={l.to}>
                            <ListItemText primary={l.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box px={2} pb={2}>
                {!(user && user.username) ? (
                    <ButtonGroup fullWidth variant="contained" aria-label="auth actions">
                        <Button onClick={() => navigate('/auth/login')}>Вход</Button>
                        <Button onClick={() => navigate('/auth/registration')}>Регистрация</Button>
                    </ButtonGroup>
                ) : (
                    <Button fullWidth variant="outlined" onClick={handleLogout} startIcon={<Logout />}>Выйти</Button>
                )}
            </Box>
        </Box>
    );

    return (
        <AppBar position="static" color="primary" enableColorOnDark>
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ gap: 2 }}>
                    {/* Mobile menu button */}
                    <Box sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={toggleMobile}
                            aria-label="open drawer"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {/* Logo */}
                    <Button color="inherit" component={RouterLink} to="/" sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
                        ВАУbakova
                    </Button>

                    {/* Desktop links */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        {links.map(l => (
                            <Button key={l.to} color="inherit" component={RouterLink} to={l.to}>
                                {l.name}
                            </Button>
                        ))}
                    </Box>

                    {/* Right side */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                        {!(user && user.username) ? (
                            <>
                                <IconButton color="inherit" onClick={handleMenuOpen}>
                                    <PersonOutlineOutlinedIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    <MenuItem disabled>
                                        <ListItemIcon>
                                            <AccountCircle fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>
                                            <Typography variant="body2">{user?.username ?? 'Гость'}</Typography>
                                        </ListItemText>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={() => navigate('/auth/login')}>
                                        <ListItemText>Вход</ListItemText>
                                    </MenuItem>
                                    <MenuItem onClick={() => navigate('/auth/registration')}>
                                        <ListItemText>Регистрация</ListItemText>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <IconButton color="inherit" onClick={handleMenuOpen}>
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    <MenuItem disabled>
                                        <ListItemIcon>
                                            <AccountCircle fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>
                                            <Typography variant="body2">{user?.username}</Typography>
                                        </ListItemText>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={handleLogout}>
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        Выйти
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>

            {/* Mobile drawer */}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={toggleMobile}
                ModalProps={{ keepMounted: true }}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    );
};
