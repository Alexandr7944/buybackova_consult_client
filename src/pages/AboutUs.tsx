import {ImageList, ImageListItem,  Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Divider, } from '@mui/material';
import {CheckCircle, Person, Star, Groups} from '@mui/icons-material';
import img from '../assets/image/photo_2025-10-31_10-16-52.jpg';

export const AboutUs = () => {
    return (
        <>
            <Typography variant="h4" component="h3" gutterBottom align="center" sx={{fontWeight: 'bold', mb: 4}}>
                О нашей команде
            </Typography>

            {/*comand*/}
            <Card elevation={3} sx={{mb: 4}}>
                <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom sx={{fontWeight: 'bold'}}>
                        Команда методологов анализа уровня развития системы управления клиентским опытом:
                    </Typography>

                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <Person color="primary"/>
                            </ListItemIcon>
                            <ListItemText
                                primary="ВАСНЕВА ПОЛИНА"
                                secondary="Эксперт в управлении клиентским опытом, стандартизации и цифровизации клиентских путей"
                            />
                        </ListItem>

                        <ListItem>
                            <ListItemIcon>
                                <Person color="primary"/>
                            </ListItemIcon>
                            <ListItemText
                                primary="ГАЛЬЦОВА ЕВГЕНИЯ"
                                secondary="Эксперт в управлении клиентским опытом, аналитик, руководитель проектов автоматизации клиентских путей"
                            />
                        </ListItem>

                        <ListItem>
                            <ListItemIcon>
                                <Person color="primary"/>
                            </ListItemIcon>
                            <ListItemText
                                primary="МАКАРЕНКО КСЕНИЯ"
                                secondary="Эксперт в маркетинговых стратегиях и управлении клиентским опытом"
                            />
                        </ListItem>
                    </List>
                    <ImageList
                        sx={{
                            width: '100%',
                            height: 'auto',
                            margin: 0,
                            overflow: 'hidden'
                        }}
                        variant="quilted"
                        cols={1}
                    >
                        <ImageListItem>
                            <img
                                srcSet={img}
                                src={img}
                                alt="My team"
                                loading="lazy"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover'
                                }}
                            />
                        </ImageListItem>
                    </ImageList>

                </CardContent>
            </Card>

            {/*leader*/}
            <Card elevation={3} sx={{mb: 4}}>
                <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom sx={{fontWeight: 'bold'}}>
                        Ведущий методолог: ОЛЬГА БАЙБАКОВА
                    </Typography>

                    <Typography>
                        Эксперт по внедрению управленческих систем на базе международных стандартов как в сфере производства, так и услуг.
                    </Typography>

                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="primary"/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Автор книги «И.Д.Е.А.льный сервис: от отдельных инициатив к целостной системе», издательство ЭКСМО, 2023"/>
                        </ListItem>

                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="primary"/>
                            </ListItemIcon>
                            <ListItemText primary="Лучший CX Директор/ Руководитель клиентского опыта по итогам премии CX World Awards в 2025 году"/>
                        </ListItem>

                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="primary"/>
                            </ListItemIcon>
                            <ListItemText primary="Персона месяца делового журнала Business Excellence"/>
                        </ListItem>
                    </List>

                    <Typography sx={{mt: 2, mb: 2}}>
                        С 2014 года консультирую крупные компании, которые развивают качество и клиентский опыт системно на основе научного подхода.
                    </Typography>

                    <Typography >
                        Среди моих постоянных клиентов: компания контура РОСНАНО, производственные компании международного уровня, медицинские
                        клиники, образовательные учреждения.
                    </Typography>
                </CardContent>
            </Card>

            {/*achievements*/}
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom sx={{fontWeight: 'bold'}}>
                        Профессиональные достижения:
                    </Typography>

                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <Star color="primary"/>
                            </ListItemIcon>
                            <ListItemText
                                primary="СХ-директор УК MANTERA"
                                secondary={
                                    <>
                                        Развиваем комплексную модель системы качества сервиса на базе международного стандарта ISO 23592:2021
                                        «Превосходный сервис: принципы и модель» на крупнейших объектах индустрии гостеприимства (Курорты Архыз и
                                        Красная Поляна, Сочи Парк, более 15 отелей, винодельня Шато де Талю и многие другие). Мы первые в РФ
                                        верифицировали нашу систему сервиса по международным стандартам!
                                    </>
                                }
                            />
                        </ListItem>

                        <Divider component="li" sx={{my: 1}}/>

                        <ListItem>
                            <ListItemIcon>
                                <Star color="primary"/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Победитель премии CX World Awards в номинации 'Лучшие практики измерения и улучшения клиентского опыта' в 2024 году."/>
                        </ListItem>

                        <Divider component="li" sx={{my: 1}}/>

                        <ListItem>
                            <ListItemIcon>
                                <Groups color="primary"/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Партнер-преподаватель и аудитор органа по сертификации TÜV AUSTRIA по стандарту ISO 23592:2021 'Совершенство сервиса: принципы и модель'"/>
                        </ListItem>

                        <Divider component="li" sx={{my: 1}}/>

                        <ListItem>
                            <ListItemIcon>
                                <Groups color="primary"/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Член Технического комитета Росстандарта ТК-504 'Совершенство сервиса'"/>
                        </ListItem>

                        <Divider component="li" sx={{my: 1}}/>

                        <ListItem>
                            <ListItemIcon>
                                <Groups color="primary"/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Член жюри CX World Awards с 2023 года"/>
                        </ListItem>
                        <Divider component="li" sx={{my: 1}}/>

                        <ListItem>
                            <ListItemIcon>
                                <Groups color="primary"/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Сертифицированный тренер по стендфордской программе дизайн-мышления d.standard"/>
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
        </>
    );
};
