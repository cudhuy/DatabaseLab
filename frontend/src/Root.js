import store from "src/redux/store";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { IntlProvider } from "react-intl";
import { Box } from "@mui/material";
import ThemeWrapper from "src/ThemeWrapper";

const notistackRef = React.createRef();
const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
};

const Root = () => {
    return (
        <Provider store={store}>
            <IntlProvider locale="en">
                <SnackbarProvider
                    maxSnack={3}
                    ref={notistackRef}
                    action={(key) => (
                        <Box
                            style={{
                                color: "rgba(255, 255, 255, 0.8)",
                                cursor: "pointer",
                                padding: "0px 8px",
                            }}
                            onClick={onClickDismiss(key)}
                        >
                            Dismiss
                        </Box>
                    )}
                >
                    <Router>
                        <ThemeWrapper />
                    </Router>
                </SnackbarProvider>
            </IntlProvider>
        </Provider>
    );
};

export default Root;
