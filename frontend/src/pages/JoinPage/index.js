import { Box } from "@mui/material";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Typography } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import ListImg from "src/pages/JoinPage/ListImg";
import { useSelector } from "react-redux";
import Empty from "src/components/Empty";
import { FormattedNumber } from "react-intl";

const CustomClass = styled(Box)((theme) => ({
    ".title": {
        color: theme.theme.palette.primary.main,
        fontSize: "larger",
        fontWeight: "bold",
        textAlign: "center",
    },
    ".hr": {
        borderTop: "1px solid",
        borderColor: theme.theme.palette.light.main,
    },
}));

const JoinPage = () => {
    const turnPriceCommon = useSelector((state) => state.gameSlice.turnPrice);
    const dayPriceCommon = useSelector((state) => state.gameSlice.dayPrice);
    const imgGameData = useSelector((state) => state.gameSlice.data);
    const imgCommonGames = imgGameData
        .filter((ele) => {
            return ele.type == 1;
        })
        .map((ele) => {
            return {
                url: ele?.image?.url,
                title: ele.name,
                description: ele?.description,
                type: ele.type,
                price: ele.price,
            };
        });
    const imgPaidGame = imgGameData
        .filter((ele) => {
            return ele.type == 2;
        })
        .map((ele) => {
            return {
                url: ele?.image?.url,
                title: ele.name,
                description: ele?.description,
                type: ele.type,
                price: ele.price,
            };
        });
    const theme = useTheme();
    return (
        <CustomClass>
            <Helmet>
                <title>Tinkerbell Garden - Games</title>
            </Helmet>
            <Box py={1}></Box>
            <Typography className="title">Common Games</Typography>
            <Typography className="title">
                Turn ticket: {<FormattedNumber value={parseInt(turnPriceCommon)} />} VNĐ / 2h
            </Typography>
            <Typography className="title">
                Day ticket: {<FormattedNumber value={parseInt(dayPriceCommon)} />} VNĐ / 1day
            </Typography>
            <Box className="hr"></Box>
            <Box py={2}></Box>
            {imgPaidGame.length > 0 ? (
                <ListImg data={imgCommonGames} />
            ) : (
                <Box py={3} textAlign="center">
                    <Empty color={theme.palette.primary.main} title="There is no Common Game available now!!" />
                </Box>
            )}

            <Box py={2}></Box>

            <Typography className="title">Paid Game</Typography>
            <Box className="hr"></Box>
            <Box py={2}></Box>
            {imgPaidGame.length > 0 ? (
                <ListImg data={imgPaidGame} />
            ) : (
                <Box py={3} textAlign="center">
                    <Empty color={theme.palette.primary.main} title="There is no Paid Game available now!!" />
                </Box>
            )}

            <Box py={1}></Box>
        </CustomClass>
    );
};

export default JoinPage;
