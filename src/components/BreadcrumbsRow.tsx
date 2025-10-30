import {Breadcrumbs, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import type {FC} from "react";

type BreadcrumbsRowProps = {
    links: Array<{
        href: string,
        name: string
    }>,
    name: string
}

export const BreadcrumbsRow: FC<BreadcrumbsRowProps> = ({links, name}) => {
    return (
        <Breadcrumbs
            aria-label="breadcrumb"
            className="no-print"
            sx={{paddingBottom: 2}}
        >
            <RouterLink to="/" className="flex items-center">
                <HomeIcon sx={{mr: 0.5}} fontSize="inherit"/>
                Объекты
            </RouterLink>
            {
                links.map(({href, name}) => (
                    <RouterLink key={href} to={href}>
                        {name}
                    </RouterLink>
                ))
            }

            <Typography sx={{color: 'text.primary', display: 'flex', alignItems: 'center'}}>
                {name}
            </Typography>
        </Breadcrumbs>
    )
}
