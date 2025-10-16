import { Box, useTheme, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Helmet from "react-helmet";
import WrapperAdmin from "src/pages/admin/WrapperAdmin";
import Overview from "./Overview";
import EventStats from "./EventStats";
import PaidGameChart from "./PaidGameChart";
import VIPRanking from "./VIPRanking";
import { fetchAll } from "src/redux/slices/statistics";
import { FS } from "src/redux/slices/other/constant";
import { useSelector, useDispatch } from "react-redux";
import { css } from "@emotion/react";
import { FadeLoader } from "react-spinners";

const override = css`
    display: block;
    margin: 0 auto;
`;

const Statistics = () => {
    const fetchingStatus = useSelector((state) => state.statisticsSlice.fetchingStatus);
    const dp = useDispatch();
    const theme = useTheme();
    const init = async () => {
        await dp(fetchAll());
    };

    useEffect(() => {
        // if (fetchingStatus == FS.INITIAL) {
        init();
        // }
    }, []);

    if (fetchingStatus == FS.FETCHING) {
        return (
            <Box style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <FadeLoader color={theme.palette.primary.main} size={100} css={override} speedMultiplier={2} />
            </Box>
        );
    }

    if (fetchingStatus == FS.FAIL) {
        return (
            <Box style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography style={{ color: "red", fontSize: "larger" }}>Error fetching</Typography>
            </Box>
        );
    }

    return (
        <WrapperAdmin>
            <Box>
                <Helmet>
                    <title>Tinkerbell Garden - Statistics</title>
                </Helmet>
                <Overview />
                <EventStats />
                <Box py={1}></Box>
                <PaidGameChart />
                <Box py={1}></Box>
                <VIPRanking />
            </Box>
        </WrapperAdmin>
    );
};

export default Statistics;
