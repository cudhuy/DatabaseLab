import { Box, Container } from "@mui/material";
import React, { Fragment } from "react";
import Footer from "src/layout/Footer";
import Header from "src/layout/Header";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectRole } from "src/redux/slices/auth-slice";

const MainLayoutContainer = styled(Box)((theme) => ({
    backgroundColor: theme.theme.palette.background.body.main,
    height: "fit-content",
    width: "100%",
    // minWidth: "fit-content",//ERRRRRRRRROOOOOORRRRRR
}));

export default function MainLayout(props) {
    const location = useLocation();
    const role = useSelector((state) => selectRole(state));
    return (
        <MainLayoutContainer>
            {/* Must use padding because margin will not count in 100vh */}
            {/* <Box style={{padding: "5px 8px 0px 8px", position: "sticky", top: 0, zIndex: 5}}> */}
            <Header />
            {/* </Box> */}
            <Box position="relative">
                {role == "admin" || role == "staff" || location.pathname == "/events" ? (
                    <Box minHeight="calc(100vh - 65px - 55px)" py={2}>
                        {location.pathname != "/home" ? (
                            <Container maxWidth="xl">{props.children}</Container>
                        ) : (
                            <Fragment>{props.children}</Fragment>
                        )}
                    </Box>
                ) : (
                    <Box minHeight="calc(100vh - 65px - 295px)" py={2}>
                        {location.pathname != "/home" ? (
                            <Container maxWidth="xl">{props.children}</Container>
                        ) : (
                            <Fragment>{props.children}</Fragment>
                        )}
                    </Box>
                )}
            </Box>
            <Box py={1}></Box>
            <Footer />
        </MainLayoutContainer>
    );
}
