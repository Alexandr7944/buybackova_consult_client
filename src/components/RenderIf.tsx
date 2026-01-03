import type {ReactNode} from "react";
import {Box, Typography, type BoxProps} from "@mui/material";

interface RenderIfProps {
    condition: boolean | (() => boolean);
    children: ReactNode;
    fallback?: ReactNode;
    fallbackMessage?: string;
    containerProps?: BoxProps;
}

export const RenderIf = ({
                             condition,
                             children,
                             fallback,
                             fallbackMessage,
                             containerProps = {}
                         }: RenderIfProps) => {
    const shouldRender = typeof condition === 'function' ? condition() : condition;

    if (shouldRender) {
        return <>{children}</>;
    }

    if (fallback || fallbackMessage) {
        return (
            <Box {...containerProps}>
                {fallback || (
                    <Typography variant="body2" color="text.secondary">
                        {fallbackMessage}
                    </Typography>
                )}
            </Box>
        );
    }

    return null;
};
