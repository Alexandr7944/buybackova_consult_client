import {Breadcrumbs, Link, Typography} from "@mui/material";
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
            <Link
                underline="hover"
                sx={{display: 'flex', alignItems: 'center'}}
                color="inherit"
                href="/"
            >
                <HomeIcon sx={{mr: 0.5}} fontSize="inherit"/>
                Объекты
            </Link>
            {
                links.map(({href, name}) => (
                    <Link
                        key={href}
                        underline="hover"
                        sx={{display: 'flex', alignItems: 'center'}}
                        color="inherit"
                        href={href}
                    >
                        {name}
                    </Link>
                ))
            }

            <Typography
                sx={{color: 'text.primary', display: 'flex', alignItems: 'center'}}
            >
                {name}
            </Typography>
        </Breadcrumbs>
    )
}
