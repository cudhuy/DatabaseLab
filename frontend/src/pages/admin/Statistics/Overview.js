import { Box, Button, Typography, Grid } from "@mui/material";
import React, { useState } from "react";
import { styled, useTheme } from "@mui/system";
import clsx from "clsx";
import boxImg1 from "./assets/box1.svg";
import { formatInteger } from "src/utils/format";
import AnimatedNumber from "src/components/AnimatedNumber/index.js";
import { useSelector } from "react-redux";
import { fetchTotalProfit } from "src/redux/slices/statistics";

const CustomClass = styled(Box)((theme) => ({
    ".btnGroup": {
        background: theme.theme.palette.hover.white,
        borderRadius: "5px",
        width: "fit-content",
    },
    ".btn": {
        width: "100px",
        height: "40px",
        color: theme.theme.palette.commonText.black,
    },
    ".selectedBtn": {
        background: theme.theme.palette.primary.main,
        color: "white",
    },
    ".box1": {
        width: "373px",
        height: "87px",
        backgroundImage: `url(${boxImg1})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center, center",
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    ".overviewText": {
        fontWeight: 700,
        fontSize: "30px",
        textAlign: "center",
    },
}));

const Overview = () => {
    const entranceTicketProfit = useSelector((state) => state.statisticsSlice.entranceTicketProfit);
    const paidGameTicketProfit = useSelector((state) => state.statisticsSlice.paidGameTicketProfit);
    const [entranceProfit, setEntranceProfit] = useState(entranceTicketProfit?.day);
    const [paidGameProfit, setPaidGameProfit] = useState(paidGameTicketProfit?.day);
    const [range, setRange] = useState("24h");
    const listRange = [
        {
            key: "24h",
            text: "24H",
        },
        {
            key: "7d",
            text: "7 Days",
        },
        {
            key: "30d",
            text: "30 Days",
        },
        {
            key: "1y",
            text: "1 Year",
        },
    ];
    const onChangeRange = (key) => {
        setRange(key);
        switch (key) {
            case "24h": {
                setEntranceProfit(entranceTicketProfit?.day);
                setPaidGameProfit(paidGameTicketProfit?.day);
                break;
            }
            case "7d": {
                setEntranceProfit(entranceTicketProfit?.week);
                setPaidGameProfit(paidGameTicketProfit?.week);
                break;
            }
            case "30d": {
                setEntranceProfit(entranceTicketProfit?.month);
                setPaidGameProfit(paidGameTicketProfit?.month);
                break;
            }
            case "1y": {
                setEntranceProfit(entranceTicketProfit?.year);
                setPaidGameProfit(paidGameTicketProfit?.year);
                break;
            }
        }
    };
    if (!entranceTicketProfit || !paidGameTicketProfit) {
        return null;
    }
    const theme = useTheme();
    return (
        <CustomClass>
            <Box py={1}></Box>
            <Box className={"btnGroup"}>
                {listRange.map((item) => (
                    <Button
                        key={item.key}
                        className={clsx("btn", { ["selectedBtn"]: range === item.key })}
                        onClick={() => onChangeRange(item.key)}
                        variant={range === item.key ? "contained" : undefined}
                    >
                        {item.text}
                    </Button>
                ))}
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Box alignSelf={"end"} mt={1}>
                        <Typography
                            style={{ color: theme.palette.commonText.black, marginLeft: "70px", fontSize: "larger" }}
                        >
                            Entrance Ticket Profit:
                        </Typography>
                        <Box className="box1">
                            <Typography className={"overviewText"}>
                                <AnimatedNumber
                                    value={entranceProfit || 0}
                                    duration={500}
                                    formatValue={(v) => formatInteger(v)}
                                />
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box alignSelf={"end"} mt={1}>
                        <Typography style={{ color: "black", marginLeft: "70px", fontSize: "larger" }}>
                            Paid Game Ticket Profit:
                        </Typography>
                        <Box className="box1">
                            <Typography className={"overviewText"}>
                                <AnimatedNumber
                                    value={paidGameProfit || 0}
                                    duration={500}
                                    formatValue={(v) => formatInteger(v)}
                                />
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Box py={2}></Box>
        </CustomClass>
    );
};

export default Overview;
