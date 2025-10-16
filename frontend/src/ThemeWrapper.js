import React, { useEffect } from "react";
import App from "src/App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { GlobalStyles } from "@mui/material";
import globalStylesCSS from "./theme/GlobalStyles";
import { useDispatch, useSelector } from "react-redux";
import { checkTheme } from "./redux/slices/themeSlice";

export default function ThemeWrapper() {
    useEffect(() => {
        init();
    }, []);
    const dp = useDispatch();
    const init = async () => {
        dp(checkTheme());
    };
    const { isDarkMode } = useSelector((state) => state.themeSlice);
    console.log(isDarkMode);
    const theme = createTheme({
        typography: {
            fontFamily: "Signika Negative",
            fontSize: 16, //1.2rem=19.2px for header. 16px for normal text
        },
        palette: {
            background: {
                paper: !isDarkMode ? "#403D4E" : "#293444", //color of drawer
                body: !isDarkMode
                    ? { main: "#FFFFFF", secondary: "#24BD9D 58%" }
                    : { main: "#ece9ff", secondary: "#069fe9 58%" },
                header: !isDarkMode
                    ? { main: "#F2F1F8", chosenText: "#FFFFFF" }
                    : { main: "#F2F1F8", chosenText: "#FFFFFF" },
            },
            primary: !isDarkMode ? { main: "#099D7E" } : { main: "#0a8bc9" },
            secondary: !isDarkMode ? { main: "#403D4E" } : { main: "#293444" },
            light: !isDarkMode ? { main: "#24BD9D" } : { main: "#069fe9" },
            shadow: !isDarkMode
                ? { main: "0px 3px 10px rgba(0, 0, 0, 0.25)" }
                : { main: "0px 3px 10px rgba(0, 0, 0, 0.25)" },
            shadowLarge: !isDarkMode
                ? { main: "0px 3px 10px rgba(0, 0, 0, 0.7)" }
                : { main: "0px 3px 10px rgba(0, 0, 0, 0.7)" },
            footer: !isDarkMode ? "#403D4E" : "#293444",
            commonText: {
                black: "#000000",
                white: "#FFFFFF",
                grayWhite: "#F4EEEE",
            },
            hover: !isDarkMode ? { white: "#a3a2a2" } : { white: "#dcd6d6" },
        },
        breakpoints: {
            values: {
                xs: 0,
                sm: 576,
                md: 768,
                lg: 992,
                xl: 1200,
                xxl: 1400,
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                    },
                },
            },
        },
    });
    console.log(theme);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles styles={globalStylesCSS} />
            <App />
        </ThemeProvider>
    );
}
