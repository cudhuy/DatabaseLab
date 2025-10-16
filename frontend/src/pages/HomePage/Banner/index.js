import React from "react";
import { styled } from "@mui/system";
import backgroundTopHomePage from "../assets/HomePageTop.jpg";
import { Box, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Boop from "src/components/animations/Boop.js";

const CustomClass = styled(Box, {
    shouldForwardProp: (prop) => prop !== "fontWeight" && prop !== "myProp",
})(({ theme, myProp, fontWeight }) => ({
    ".background": {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundTopHomePage})`,
        backgroundPositionX: "center",
        backgroundPositionY: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "absolute",
        boxShadow: theme.palette.shadowLarge.main,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    ".title": {
        color: theme.palette.commonText.white,
        fontSize: "50px",
        fontWeight: "bold",
        textAlign: "center",
        width: "100%",
    },
    ".smallText": {
        textAlign: "center",
        color: theme.palette.commonText.white,
        fontSize: "30px",
        fontWeight: "lighter",
        maxWidth: "50%",
        [theme.breakpoints.down("lg")]: {
            maxWidth: "65%",
        },
        [theme.breakpoints.down("md")]: {
            maxWidth: "90%",
        },
    },
    ".firstButton": {
        color: theme.palette.light,
        fontWeight: "bolder",
    },
    ".secondButton": {
        fontWeight,
    },
}));

const Banner = () => {
    const navigate = useNavigate();
    const contact = () => {
        navigate("/contact");
    };
    return (
        <CustomClass fontWeight="lighter">
            <Box className={"background"}>
                <Boop y={10} timing={100}>
                    <Box className={"title"}>Tinkerbell Garden</Box>
                </Boop>
                <Box className={"smallText"}>Tinkerbell Park would be the best place for your family this weekends</Box>
                <Box>
                    <Grid container spacing={2} style={{ whiteSpace: "nowrap" }}>
                        <Grid item>
                            <Boop scale={1.05} timing={100}>
                                <Button
                                    size="large"
                                    variant="contained"
                                    color="secondary"
                                    className={"firstButton"}
                                    href={"#event"}
                                >
                                    Get started
                                </Button>
                            </Boop>
                        </Grid>
                        <Grid item>
                            <Boop scale={1.05} timing={100}>
                                <Button
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    className={"secondButton"}
                                    onClick={contact}
                                >
                                    Contact us
                                </Button>
                            </Boop>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Box height="60vh"></Box>
        </CustomClass>
    );
};

export default Banner;
