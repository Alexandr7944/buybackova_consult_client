import { Typography, Card, CardContent, Box, Grid, useTheme, useMediaQuery} from "@mui/material";

export const Methodology = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));


    const getItemMargin = (index: number) => isMobile ? 0 : `${index * 18}%`;

    const cardContent = [
        {
            title: 'Компания на уровне коррекции проблем',
            body:  'анализируются продажи, фокус на рейтингах в интернете вместо системной работы над улучшением клиентского опыта, реакция на жалобы клиента - "снижение градуса негатива", системный сбор NPS и CSI/CSAT не ведется.'
        },
        {
            title: 'Компания на уровне предупреждения проблем',
            body:  'наличие СХ-стратегии, регулярный анализ NPS и его влияния на метрики бизнеса, проекты по операционной эффективности и работа с вовлеченностью сотрудников, работа с улучшениями на базе анализа CJM и EJM'
        },
        {
            title: 'Компания на уровне результативной системы управления клиентским опытом',
            body:  'действия с проактивного уровня оказывают прямое влияние на CLTV (customer lifetime value - пожизненной ценности клиента)'
        },
        {
            title: 'Компания на уровне эффективной CX-стратегии',
            body:  'CLTV - ключевая метрика системы, умение прогнозировать отток и возвратность клиентов, инвестировать в направления, напрямую влияющие на доходность бизнеса при снижении стоимости привлечения.'
        },
    ]

    return (
        <>
            <Typography
                variant="h4"
                component="h3"
                gutterBottom
                align="center"
                sx={{fontWeight: 'bold', mb: 4}}
            >
                Методология
            </Typography>

            <Card elevation={3} sx={{mb: 4}}>
                <CardContent sx={{p: 4}}>
                    <Typography variant="body1" mb={2}>
                        В основе предложенной методологии лежит международный стандарт ISO 23592:2021 «Совершенный сервис: принципы и модель».
                    </Typography>
                    <Typography variant="body1" mb={2}>
                        Используя аудит по чек-листу, Вы сможете оценить уровень развития системы управления клиентским опытом, для определения
                        дальнейших векторов развития организации.
                    </Typography>
                    <Typography variant="body1" mb={2}>
                        Наша конечная цель: научиться развивать клиентский опыт системно на основе цифровых данных для достижения доходности бизнеса.
                    </Typography>
                </CardContent>
            </Card>


            <Card elevation={3} sx={{mb: 4, p: 3}} className="relative">
                <CardContent>

                    <Grid container direction="column-reverse" spacing={3}>
                        {/* Footer section */}
                        <Grid sx={{position: {xs: "static", md: "absolute"}, bottom: 24, right: 16}}>
                            <Typography variant="body1" color="error.main" textTransform="uppercase">
                                4 уровень - ясные ответы на вопросы
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                «Во что инвестировать?» <span style={{color: theme.palette.error.main}}>и</span>
                                <br/>
                                «Что нам дают эти инвестиции?»
                            </Typography>
                        </Grid>

                        {/* Main content blocks */}
                        {cardContent.map((item, index) => (
                            <Grid key={item.title} position={"relative"}>
                                <Box
                                    width={isMobile ? "100%" : "46%"}
                                    ml={getItemMargin(index)}
                                    p={2}
                                    borderRadius={1}
                                    border={"1px solid #e5e5e5"}
                                    position="relative"
                                    sx={{
                                        boxShadow:       "0px 0px 10px rgba(0, 0, 0, 0.1)",
                                        zIndex:          1
                                    }}
                                >
                                    <Box
                                        className="absolute top-0 left-0 -translate-1/2 rounded-[55%] bg-gray-100 text-gray-600 text-3xl"
                                        sx={{
                                            width:          40,
                                            height:         40,
                                            display:        "flex",
                                            alignItems:     "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {index + 1}
                                    </Box>
                                    <Typography variant="body1" fontWeight="medium" mb={1}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.body}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}

                        {/* Header section */}
                        <Grid sx={{position: {xs: "static", md: "absolute"}, top: 16, left: 24}}>
                            <Typography variant="h6" color="error.main" textTransform="uppercase">
                                Авторская модель
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Развертывание стандарта ISO 23592:2021<br/>
                                до конкретных инструментов и решений
                            </Typography>
                        </Grid>
                    </Grid>

                </CardContent>
            </Card>
        </>
    )
}
