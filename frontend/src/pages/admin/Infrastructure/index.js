import { Box, Typography } from "@mui/material";
import { useTheme, styled } from "@mui/system";
import React, { useState, useEffect, Fragment } from "react";
import Helmet from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import WrapperAdmin from "src/pages/admin/WrapperAdmin";
import { css } from "@emotion/react";
import { fetchReport } from "src/redux/slices/reportSlice";
import FadeLoader from "react-spinners/ClockLoader";
import { FS } from "src/redux/slices/other/constant";
import CloseIcon from "@mui/icons-material/Close";
import InfrastructureActions from "src/pages/admin/Infrastructure/InfrastructureAction";
import InfrastructureData from "src/pages/admin/Infrastructure/InfrastructureData";

const CustomClass = styled(Box)((theme) => ({
    ".loader": {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    ".titleReportInf": {
        fontWeight: "bold",
        fontSize: "larger",
        textAlign: "center",
    },
}));

const override = css`
    display: block;
    margin: 0 auto;
`;

const Infrastructure = () => {
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
    // const dp = useDispatch();
    // const theme = useTheme();
    // const { reports, fetchingStatus, reportConfig } = useSelector(state => state.reportSlice);
    // console.log(reports);

    // const fetchData = async () => {
    //     let start = reportConfig.start,
    //         end = reportConfig.end,
    //         listId = reportConfig.listId,
    //         listStatus = reportConfig.listStatus,
    //         search = reportConfig.search,
    //         sort = reportConfig.gamsorteId;
    //     await Promise.all([dp(fetchReport({ start, end, listStatus, listId, search, sort }))]);
    // };

    // useEffect(() => {
    //     fetchData();
    // }, [reportConfig]);

    // if (fetchingStatus === FS.INITIAL || fetchingStatus === FS.FETCHING) {
    //     return(
    //         <CustomClass>
    //             <Box className={"loader"}>
    //                 <FadeLoader color={theme.palette.primary.main} size={100} css={override} speedMultiplier={2} />
    //             </Box>
    //         </CustomClass>
    //     );
    // }

    // if (fetchingStatus === FS.FAIL) {
    //     return (
    //         <Box py={3} display="flex" flexDirection="column" alignItems="center">
    //             <CloseIcon color="error" />
    //             <Box py={1} />
    //             <Typography color="error">Error when fetching data. Please try again!</Typography>
    //         </Box>
    //     );
    // }
    const [gameType, setGameType] = useState(0);

    return (
        <WrapperAdmin>
            <CustomClass>
                <Helmet>
                    <title>Tinkerbell Garden - Infrastructure</title>
                </Helmet>
                <InfrastructureActions {...{ gameType, setGameType }} />
                <Box py={1}></Box>
                {gameType != 2 && (
                    <Fragment>
                        <Typography className="titleReportInf">Common Games</Typography>
                        <Box py={1}></Box>
                        <InfrastructureData games={imgCommonGames} />
                        <Box py={1}></Box>
                    </Fragment>
                )}
                {gameType != 1 && (
                    <Fragment>
                        <Typography className="titleReportInf">Paid Games</Typography>
                        <Box py={1}></Box>
                        <InfrastructureData games={imgPaidGame} />
                        <Box py={1}></Box>
                    </Fragment>
                )}
            </CustomClass>
        </WrapperAdmin>
    );
};

export default Infrastructure;
