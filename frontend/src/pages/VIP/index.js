import React, { useEffect, Fragment } from "react";
import { Box, Typography } from "@mui/material";
import VIPInfo from "./VIPInfo";
import VIPPay from "./VIPPay";
import { useDispatch, useSelector } from "react-redux";
import { FS } from "src/redux/slices/other/constant";
import { useTheme } from "@emotion/react";
import { css } from "@emotion/react";
import FadeLoader from "react-spinners/ClockLoader";

const override = css`
    display: block;
    margin: 0 auto;
`;

const VIP = () => {
    const theme = useTheme();
    const vipAccount = useSelector((state) => state.vipSlice.infoVIP);
    const fetchingStatus = useSelector((state) => state.vipSlice.fetchingStatus);

    if (fetchingStatus == FS.FETCHING) {
        return (
            <Box className={"loader"}>
                <FadeLoader color={theme.palette.primary.main} size={100} css={override} speedMultiplier={2} />
            </Box>
        );
    }

    if (fetchingStatus == FS.FAIL) {
        return <Typography style={{ textAlign: "center", color: "red" }}>Error fetching</Typography>;
    }

    if (!vipAccount?.id) {
        return (
            <Typography style={{ textAlign: "center", fontSize: "larger", padding: "20px" }}>
                Please register to become VIP member at the counter first
            </Typography>
        );
    }
    return (
        <Fragment>
            <VIPInfo />
            <VIPPay />
        </Fragment>
    );
};

export default VIP;
