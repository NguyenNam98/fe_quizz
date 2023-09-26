import {ThemeProvider} from "@mui/material";
import {theme} from "@/theme.config";

export default function Template({children,}: { children: React.ReactNode }) {
    return (
        <>
            <ThemeProvider theme = {theme}>
                    {children}
            </ThemeProvider>
        </>
    )
}
