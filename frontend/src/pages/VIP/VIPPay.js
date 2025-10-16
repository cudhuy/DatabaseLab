import React, { useState } from "react";
import { Box, Typography, Paper, Grid, Button, TextField } from "@mui/material";
import { styled } from "@mui/system";

const CustomClass = styled(Box)((theme) => ({}));

const VIP = () => {
    const data = "";
    const handlePayPaypal = () => {};
    return (
        <CustomClass>
            <Box py={1}></Box>
            {/* <Button variant="contained" onClick={handlePayPaypal}>
                Pay VIP by Paypal
            </Button> */}
            <Box py={1}></Box>
            <Typography>{data}</Typography>
            <Box py={1}></Box>
        </CustomClass>
    );
};

export default VIP;
