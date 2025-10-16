import { Box, Button, Typography, Grid, Container } from "@mui/material";
import React, { useState, Fragment } from "react";
import { styled, useTheme } from "@mui/system";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useSelector } from "react-redux";

const CustomClass = styled(Box)((theme) => ({
    ".titleText": {
        color: theme.theme.palette.commonText.black,
        fontSize: "30px",
        fontWeight: "bold",
    },
}));

const Overview = () => {
    const data = useSelector((state) => state.statisticsSlice.ticketStatistics);
    const theme = useTheme();
    const options = {
        chart: {
            backgroundColor: theme.palette.commonText.white,
            borderRadius: "10px",
        },
        xAxis: {
            labels: {
                y: 30,
                style: {
                    color: theme.palette.commonText.black,
                    fontSize: 14,
                },
            },
            type: "datetime",
        },
        plotOptions: {
            column: {
                borderRadius: "2px",
            },
        },
        rangeSelector: {
            selected: 1,
            labelStyle: {
                display: "none",
            },
            buttonSpacing: 0,
            buttonTheme: {
                borderRadius: "10px",
                fill: "#403D4E",
                r: 3,
                width: 70,
                height: 20,
                style: {
                    color: theme.palette.commonText.white,
                    fontWeight: "bold",
                },
                states: {
                    select: {
                        fill: theme.palette.primary.main,
                        style: {
                            color: theme.palette.commonText.white,
                        },
                    },
                },
            },
            verticalAlign: "top",
            buttonPosition: {
                align: "right",
                y: 15,
                x: -10,
            },
            inputEnabled: false,
            allButtonsEnabled: true,
            buttons: [
                {
                    type: "day",
                    count: 1,
                    text: "24H",
                },
                {
                    type: "week",
                    count: 1,
                    text: "1W",
                },
                {
                    type: "month",
                    count: 1,
                    text: "1M",
                },
                {
                    type: "year",
                    count: 1,
                    text: "1Y",
                },
            ],
        },
        credits: {
            enabled: false,
        },
        title: {
            text: "",
        },
        navigator: {
            enabled: false,
        },
        scrollbar: {
            enabled: false,
        },
        yAxis: {
            opposite: false,
            min: 0,
            title: {
                text: "<em>Number</em>",
                style: {
                    color: theme.palette.commonText.black,
                },
            },
            labels: {
                style: {
                    color: theme.palette.commonText.black,
                },
            },
            gridLineColor: "#354961",
        },
        colors: [theme.palette.primary.main, theme.palette.footer, "red"],
        legend: {
            enabled: true,
            align: "left",
            verticalAlign: "top",
            layout: "horizontal",
            margin: 30,
            y: -25,
            itemStyle: {
                color: theme.palette.primary.main,
            },
            itemHoverStyle: {
                color: theme.palette.commonText.black,
            },
            itemMarginBottom: 30,
        },
        tooltip: {
            shared: true,
            valueDecimals: 0,
            valuePrefix: "",
        },
        series: data,
    };
    return (
        <CustomClass>
            <Typography className="titleText">Ticket Statistics</Typography>
            <Box style={{ overflowX: "auto", width: "100%" }}>
                <Box style={{ minWidth: "1000px" }}>
                    <HighchartsReact highcharts={Highcharts} options={options} constructorType={"stockChart"} />
                </Box>
            </Box>
        </CustomClass>
    );
};

export default Overview;
