import React, { useEffect } from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import ReportItem from "src/pages/admin/Infrastructure/ReportItem";
import { useSelector, useDispatch } from "react-redux";
import { fetchReport } from "src/redux/slices/reportSlice";
import Empty from "src/components/Empty";
import { selectTypeReport } from "src/redux/slices/reportSlice";

const ListReport = ({ games }) => {
    const dp = useDispatch();
    const { reportConfig } = useSelector((state) => state.reportSlice);
    const gameReports = useSelector((state) => selectTypeReport(state, games.length > 0 ? games[0].type : null));

    const fetchData = async () => {
        let start = reportConfig.start,
            end = reportConfig.end,
            listId = reportConfig.listId,
            listStatus = reportConfig.listStatus,
            search = reportConfig.search,
            sort = reportConfig.gamsorteId;
        await Promise.all([dp(fetchReport({ start, end, listStatus, listId, search, sort }))]);
    };

    useEffect(() => {
        fetchData();
    }, [reportConfig]);
    const theme = useTheme();

    return (
        <Box>
            {gameReports.length == 0 ? (
                <Box py={3} textAlign="center">
                    <Empty color={theme.palette.commonText.black} title="There is no report" />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {games.map((game, index) => {
                        const reportedItem = gameReports.filter((ele) => ele.gameId == game._id);
                        if (reportedItem.length > 0)
                            return (
                                <Grid key={game.gameId} item xs={11} md={6}>
                                    <ReportItem reportedItem={reportedItem} game={game} />
                                </Grid>
                            );
                        else return null;
                    })}
                </Grid>
            )}
        </Box>
    );
};

export default ListReport;
