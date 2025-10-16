import React from "react";
import { styled } from "@mui/system";
import { Box, Typography } from "@mui/material";
import ToysIcon from "@mui/icons-material/Toys";
import Boop from "src/components/animations/Boop";

const CustomClass = styled(Box)((theme) => ({
    ".bigText": {
        fontSize: "30px",
        fontWeight: "bold",
    },
    ".icon": {
        fontSize: "43px",
        display: "inline-block",
    },
    ".firstWrapper": {
        width: "100%",
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        color: theme.theme.palette.secondary.main,
    },
    ".smallText": {
        fontWeight: "lighter",
        color: theme.theme.palette.secondary.main,
        textAlign: "center",
        width: "100%",
        fontSize: "27px",
    },
    ".wrapper": {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    ".dot": {
        width: "7px",
        height: "7px",
        backgroundColor: theme.theme.palette.secondary.main,
        transform: "rotate(45deg)",
    },
    ".line": {
        height: "2px",
        width: "50%",
        backgroundColor: theme.theme.palette.secondary.main,
    },
}));

const GamesTitle = () => {
    return (
        <CustomClass>
            <Box className="firstWrapper">
                <Boop y={10} timing={100} display="flex">
                    <ToysIcon className="icon" />
                    <Typography className="bigText">&nbsp;Games</Typography>
                </Boop>
            </Box>
            <Typography className="smallText">We offer almost everything you need</Typography>
            <Box className="wrapper">
                <Box className="dot"></Box>
                <Box className="line"></Box>
                <Box className="dot"></Box>
            </Box>
            <Box py={1}></Box>
        </CustomClass>
    );
};

export default GamesTitle;
