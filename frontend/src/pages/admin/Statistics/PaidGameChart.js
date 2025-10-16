import React, { Fragment } from "react";
import { Box, Grid, Typography } from "@mui/material";
import PieChart from "./PieChart.js";
import { styled } from "@mui/system";

const CustomClass = styled(Box)((theme) => ({
    ".titleText": {
        color: theme.theme.palette.commonText.black,
        fontSize: "30px",
        fontWeight: "bold",
    },
}));

const PaidGameChart = () => {
    return (
        <CustomClass>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography className="titleText">Total Profit of Paid Games</Typography>
                    <PieChart dataType={0} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography className="titleText">Total ticket of Paid Games</Typography>
                    <PieChart dataType={1} />
                </Grid>
            </Grid>
        </CustomClass>
    );
};

export default PaidGameChart;
