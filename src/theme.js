import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    components: {
        MuiDialog: {
            styleOverrides: {
                paper: { borderRadius: 24, padding: "16px 24px" },
            },
            defaultProps: {
                slotProps: {
                    backdrop: { sx: { bgcolor: "rgba(0,0,0,.25)" } },
                },
            },
        },
    },
});

