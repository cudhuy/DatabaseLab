import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import WrapperStaff from "src/pages/staff/WrapperStaff";
import { useTheme, styled } from "@mui/system";
import ListReport from "src/pages/staff/ReportInfrastructure/ListReport";
import { fetchFirstTime } from "src/redux/slices/reportSlice";
import FadeLoader from "react-spinners/ClockLoader";
import { css } from "@emotion/react";
import { FS } from "src/redux/slices/other/constant";
import CloseIcon from "@mui/icons-material/Close";

const CustomClass = styled(Box)((theme) => ({
    ".titleReportInf": {
        fontWeight: "bold",
        fontSize: "larger",
        textAlign: "center",
    },
    ".loader": {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}));

const override = css`
    display: block;
    margin: 0 auto;
`;

const ReportInfrastructure = () => {
    const imgGameData = useSelector((state) => state.gameSlice.data);
    const imgCommonGames = imgGameData
        .filter((ele) => {
            return ele.type == 1;
        })
        .map((ele) => {
            return {
                url: ele?.image?.url,
                title: ele?.name,
                description: ele?.description,
                type: ele?.type,
                price: ele?.price,
                _id: ele._id,
            };
        });
    const imgPaidGame = imgGameData
        .filter((ele) => {
            return ele.type == 2;
        })
        .map((ele) => {
            return {
                url: ele?.image?.url,
                title: ele?.name,
                description: ele?.description,
                type: ele?.type,
                price: ele?.price,
                _id: ele._id,
            };
        });

    const { fetchingStatus } = useSelector((state) => state.reportSlice);
    const dp = useDispatch();
    const theme = useTheme();

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        await Promise.all([dp(fetchFirstTime())]);
    };

    if (fetchingStatus === FS.INITIAL || fetchingStatus === FS.FETCHING) {
        return (
            <Box className={"loader"}>
                <FadeLoader color={theme.palette.primary.main} size={100} css={override} speedMultiplier={2} />
            </Box>
        );
    }

    if (fetchingStatus === FS.FAIL) {
        return (
            <Box py={3} display="flex" flexDirection="column" alignItems="center">
                <CloseIcon color="error" />
                <Box py={1} />
                <Typography color="error">Error when fetching data. Please try again!</Typography>
            </Box>
        );
    }

    return (
        <WrapperStaff>
            <CustomClass>
                <Helmet>
                    <title>Tinkerbell Garden - Report Infrastructure</title>
                </Helmet>
                <Typography className="titleReportInf">Common Games</Typography>
                <Box py={1}></Box>
                <ListReport games={imgCommonGames} />
                <Box py={1}></Box>
                <Typography className="titleReportInf">Paid Games</Typography>
                <Box py={1}></Box>
                <ListReport games={imgPaidGame} />
            </CustomClass>
        </WrapperStaff>
    );
};

export default ReportInfrastructure;
