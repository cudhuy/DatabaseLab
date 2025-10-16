import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import Boop from "src/components/animations/Boop";

const CustomClass = styled(Box)((theme) => ({
    ".textTitle": {
        textAlign: "center",
        color: theme.theme.palette.primary.main,
        fontSize: "30px",
        fontWeight: "bold",
    },
    ".wrapper": {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    ".dot": {
        width: "5px",
        height: "5px",
        backgroundColor: theme.theme.palette.primary.main,
        transform: "rotate(45deg)",
    },
    ".line": {
        height: "1px",
        width: "25%",
        backgroundColor: theme.theme.palette.primary.main,
    },
}));

const Title = (props) => {
    const { text, icon } = props;
    return (
        <CustomClass>
            <Typography className="textTitle">
                <Boop y={10} timing={100}>
                    {icon}&nbsp;
                    {text}
                </Boop>
            </Typography>
            <Box className="wrapper">
                <Box className="dot"></Box>
                <Box className="line"></Box>
                <Box className="dot"></Box>
            </Box>
            <Box py={1}></Box>
        </CustomClass>
    );
};

export default Title;
